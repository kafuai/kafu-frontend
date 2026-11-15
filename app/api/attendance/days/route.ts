import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { hasPermission } from "@/lib/rbac/authorization";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { isDateKey } from "@/src/enterprise/business/attendance/utils/time";

export async function GET(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, identity, organizationId } = ctx;
    const canManage = hasPermission(identity.role ?? "", PERMISSIONS.ATTENDANCE_MANAGE);

    const sp = new URL(request.url).searchParams;
    const from = sp.get("from"), to = sp.get("to");
    if (!isDateKey(from) || !isDateKey(to) || to < from) {
      return NextResponse.json({ error: "Invalid date range." }, { status: 400 });
    }

    let q = supabase.from("attendance_days").select("*")
      .eq("organization_id", organizationId)
      .gte("work_date", from).lte("work_date", to)
      .order("work_date", { ascending: false }).limit(1000);

    if (!canManage) q = q.eq("user_id", user.id);
    else if (isUuid(sp.get("userId"))) q = q.eq("user_id", sp.get("userId") as string);
    if (sp.get("status")) q = q.eq("status", sp.get("status") as string);

    const { data, error } = await q;
    if (error) throw new Error(error.message);
    const rows = data ?? [];

    const userIds = [...new Set(rows.map((r) => r.user_id as string))];
    const names = new Map<string, string>();
    if (canManage && userIds.length) {
      const { data: profs } = await createSupabaseAdminClient()
        .from("profiles").select("id,full_name,email").in("id", userIds);
      for (const p of profs ?? []) names.set(p.id, p.full_name?.trim() || p.email || p.id);
    }

    const proposals = new Map<string, any[]>();
    for (let i = 0; i < rows.length; i += 100) {
      const ids = rows.slice(i, i + 100).map((r) => r.id);
      const { data: props } = await supabase.from("attendance_deduction_proposals")
        .select("id,attendance_day_id,incident_type,status,original_amount,final_amount")
        .eq("organization_id", organizationId).in("attendance_day_id", ids);
      for (const p of props ?? []) {
        const list = proposals.get(p.attendance_day_id) ?? [];
        list.push(p);
        proposals.set(p.attendance_day_id, list);
      }
    }

    return NextResponse.json({
      canManage,
      data: rows.map((r) => ({
        ...r,
        userName: names.get(r.user_id) ?? null,
        proposals: proposals.get(r.id) ?? [],
      })),
    });
  } catch (e) {
    console.error("Attendance days load failed:", e);
    return NextResponse.json({ error: "Unable to load attendance records." }, { status: 500 });
  }
}