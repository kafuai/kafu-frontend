import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";

export async function GET(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, identity, organizationId } = ctx;

    const canReview = hasPermission(identity.role ?? "", PERMISSIONS.ATTENDANCE_DEDUCTIONS_REVIEW);
    const status = new URL(request.url).searchParams.get("status");

    let q = supabase
      .from("attendance_deduction_proposals")
      .select(
        "id,user_id,incident_type,incident_date,scheduled_start,actual_at,minutes,original_amount,final_amount,status,explanation,adjustment_reason,decision_note,decided_by,decided_at,created_at",
      )
      .eq("organization_id", organizationId)
      .order("incident_date", { ascending: false })
      .limit(500);

    // غير المالك لا يرى إلا خصوماته
    if (!canReview) q = q.eq("user_id", user.id);
    if (status) q = q.eq("status", status);

    const { data, error } = await q;
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    const ids = [...new Set(rows.flatMap((r) => [r.user_id, r.decided_by]).filter(Boolean) as string[])];
    const names = new Map<string, string>();

    if (ids.length > 0) {
      const { data: profiles } = await createSupabaseAdminClient()
        .from("profiles").select("id,full_name,email").in("id", ids);
      for (const p of profiles ?? []) names.set(p.id, p.full_name?.trim() || p.email || p.id);
    }

    // حالة الإدراج في المسير تُشتق من جدول التطبيقات
    const applied = new Set<string>();
    if (rows.length > 0 && canReview) {
      const { data: apps } = await supabase
        .from("attendance_deduction_applications")
        .select("proposal_id")
        .eq("organization_id", organizationId)
        .in("proposal_id", rows.map((r) => r.id));
      for (const a of apps ?? []) applied.add(a.proposal_id);
    }

    return NextResponse.json({
      canReview,
      data: rows.map((r) => ({
        ...r,
        userName: names.get(r.user_id) ?? r.user_id,
        decidedByName: r.decided_by ? names.get(r.decided_by) ?? null : null,
        appliedToPayroll: applied.has(r.id),
      })),
    });
  } catch (error) {
    console.error("Attendance proposals load failed:", error);
    return NextResponse.json({ error: "Unable to load deductions." }, { status: 500 });
  }
}