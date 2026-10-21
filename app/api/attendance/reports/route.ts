import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { monthToPeriod } from "@/src/enterprise/business/payroll/payrollCalculator";

/** GET ?month=YYYY-MM */
export async function GET(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { supabase, organizationId } = ctx;

    const period = monthToPeriod(new URL(request.url).searchParams.get("month"));
    if (!period) return NextResponse.json({ error: 'Invalid month. Expected "YYYY-MM".' }, { status: 400 });

    const [days, props] = await Promise.all([
      supabase.from("attendance_days")
        .select("user_id,work_date,status,late_minutes,early_leave_minutes,worked_minutes")
        .eq("organization_id", organizationId).gte("work_date", period.start).lte("work_date", period.end).limit(10000),
      supabase.from("attendance_deduction_proposals")
        .select("user_id,status,final_amount")
        .eq("organization_id", organizationId).gte("incident_date", period.start).lte("incident_date", period.end).limit(10000),
    ]);
    if (days.error) throw new Error(days.error.message);
    if (props.error) throw new Error(props.error.message);

    type Agg = {
      userId: string; scheduled: number; present: number; late: number; earlyLeave: number;
      possibleAbsence: number; absent: number; incomplete: number; onLeave: number;
      lateMinutes: number; workedMinutes: number; pendingProposals: number; approvedAmount: number;
    };
    const m = new Map<string, Agg>();
    const get = (u: string): Agg => {
      let a = m.get(u);
      if (!a) {
        a = { userId: u, scheduled: 0, present: 0, late: 0, earlyLeave: 0, possibleAbsence: 0, absent: 0, incomplete: 0, onLeave: 0, lateMinutes: 0, workedMinutes: 0, pendingProposals: 0, approvedAmount: 0 };
        m.set(u, a);
      }
      return a;
    };

    for (const d of days.data ?? []) {
      const a = get(d.user_id);
      a.scheduled += 1;
      a.lateMinutes += d.late_minutes ?? 0;
      a.workedMinutes += d.worked_minutes ?? 0;
      if (d.status === "present") a.present += 1;
      if (d.status === "late" || d.status === "late_early_leave") a.late += 1;
      if (d.status === "early_leave" || d.status === "late_early_leave") a.earlyLeave += 1;
      if (d.status === "possible_absence") a.possibleAbsence += 1;
      if (d.status === "absent_confirmed") a.absent += 1;
      if (d.status === "incomplete") a.incomplete += 1;
      if (d.status === "on_leave") a.onLeave += 1;
    }
    for (const p of props.data ?? []) {
      const a = get(p.user_id);
      if (["needs_review", "in_review", "needs_extra_approval", "apply_failed"].includes(p.status)) a.pendingProposals += 1;
      if (p.status === "approved") a.approvedAmount = Math.round((a.approvedAmount + Number(p.final_amount ?? 0)) * 100) / 100;
    }

        const ids = [...m.keys()];
    const names = new Map<string, string>();
    if (ids.length) {
      const { data: profs } = await createSupabaseAdminClient().from("profiles").select("id,full_name,email").in("id", ids);
      for (const p of profs ?? []) names.set(p.id, p.full_name?.trim() || p.email || p.id);
    }

    const { data: emps } = ids.length
      ? await supabase.from("payroll_employees")
          .select("user_id,full_name,employee_number,department")
          .eq("organization_id", organizationId).in("user_id", ids)
      : { data: [] as any[] };
    const empByUser = new Map((emps ?? []).map((e) => [e.user_id as string, e]));

    return NextResponse.json({
      period,
      data: [...m.values()]
        .map((a) => {
          const e = empByUser.get(a.userId);
          return {
            ...a,
            name: e?.full_name?.trim() || names.get(a.userId) || a.userId,
            employeeNumber: e?.employee_number ?? null,
            department: e?.department ?? null,
          };
        })
        .sort((x, y) => x.name.localeCompare(y.name)),
    });
  } catch (e) {
    console.error("Attendance report failed:", e);
    return NextResponse.json({ error: "Unable to load the report." }, { status: 500 });
  }
}