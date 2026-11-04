import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext, isUuid } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { calculateProposal } from "@/src/enterprise/business/attendance/core/deductionCalculator";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!isUuid(id)) return NextResponse.json({ error: "Invalid ID." }, { status: 400 });

    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const { data: day } = await supabase.from("attendance_days").select("*")
      .eq("id", id).eq("organization_id", organizationId).maybeSingle();
    if (!day) return NextResponse.json({ error: "Not found." }, { status: 404 });
    if (day.status !== "possible_absence") {
      return NextResponse.json({ error: "Only a possible absence can be confirmed." }, { status: 409 });
    }

    const { data: updated, error } = await supabase.from("attendance_days")
      .update({ status: "absent_confirmed", evaluated_at: new Date().toISOString() })
      .eq("id", id).eq("organization_id", organizationId).eq("status", "possible_absence")
      .select("id").maybeSingle();
    if (error) throw new Error(error.message);
    if (!updated) return NextResponse.json({ error: "Already updated." }, { status: 409 });

    const [{ data: policy }, { data: emp }] = await Promise.all([
      supabase.from("attendance_deduction_policies").select("*")
        .eq("organization_id", organizationId).eq("incident_type", "absence").eq("is_active", true).maybeSingle(),
      supabase.from("payroll_employees")
        .select("id,basic_salary,housing_allowance,other_allowances")
        .eq("organization_id", organizationId).eq("user_id", day.user_id).maybeSingle(),
    ]);

    const outcome = calculateProposal({
      incidentType: "absence", minutes: null,
      scheduledMinutes: day.scheduled_minutes ?? 0,
      policy: policy as any, wage: emp,
    });

    if (outcome.kind === "proposal") {
      const { error: pErr } = await supabase.from("attendance_deduction_proposals")
        .upsert({
          organization_id: organizationId,
          user_id: day.user_id,
          payroll_employee_id: emp?.id ?? null,
          attendance_day_id: day.id,
          incident_type: "absence",
          incident_date: day.work_date,
          scheduled_start: day.scheduled_start,
          minutes: null,
          policy_id: policy?.id ?? null,
          calc_method: outcome.method,
          calc_inputs: outcome.inputs,
          explanation: outcome.explanation,
          original_amount: outcome.amount,
          status: "needs_review",
        }, { onConflict: "organization_id,attendance_day_id,incident_type", ignoreDuplicates: true });
      if (pErr) throw new Error(pErr.message);
    }

    await supabase.from("attendance_audit_log").insert({
      organization_id: organizationId, actor_id: user.id, action: "absence.confirm",
      entity_type: "attendance_day", entity_id: id, before_data: { status: "possible_absence" },
      after_data: { status: "absent_confirmed" },
    });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Absence confirmation failed:", e);
    return NextResponse.json({ error: "Unable to confirm absence." }, { status: 500 });
  }
}