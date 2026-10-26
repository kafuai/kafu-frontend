import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { addDays, dateKeyInTz, dateRange, isDateKey } from "@/src/enterprise/business/attendance/utils/time";
import {
  assignmentCovers, buildSchedule, DEFAULT_TZ,
  type AssignmentRow, type LocationRow, type ShiftRow,
} from "@/src/enterprise/business/attendance/utils/schedule";
import {
  evaluateDay, pickEffectiveEvents, type EventLite,
} from "@/src/enterprise/business/attendance/core/attendanceEvaluator";
import {
  calculateProposal, type DeductionPolicy, type IncidentType,
} from "@/src/enterprise/business/attendance/core/deductionCalculator";
import { LeaveManager, toDateKey } from "@/src/enterprise/business/leave";

const MAX_DAYS = 31;

/** POST { from: "YYYY-MM-DD", to: "YYYY-MM-DD" } */
export async function POST(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const body = await request.json().catch(() => null);
    const today = dateKeyInTz(Date.now(), DEFAULT_TZ);
    const from = body?.from;
    const to = body?.to ?? today;

    if (!isDateKey(from) || !isDateKey(to) || to < from || to > today) {
      return NextResponse.json({ error: "Invalid date range." }, { status: 400 });
    }
    const days = dateRange(from, to);
    if (days.length > MAX_DAYS) {
      return NextResponse.json({ error: `Maximum range is ${MAX_DAYS} days.` }, { status: 400 });
    }

    const now = Date.now();
    const winFrom = new Date(Date.parse(`${addDays(from, -1)}T00:00:00Z`)).toISOString();
    const winTo = new Date(Date.parse(`${addDays(to, 3)}T00:00:00Z`)).toISOString();

    const [asg, evs, corr, hol, existingDays, policies] = await Promise.all([
      supabase.from("shift_assignments")
        .select("id,user_id,shift_id,location_id,effective_from,effective_to")
        .eq("organization_id", organizationId)
        .lte("effective_from", to)
        .or(`effective_to.is.null,effective_to.gte.${from}`),
      supabase.from("attendance_events")
        .select("user_id,event_type,source,occurred_at,created_at")
        .eq("organization_id", organizationId)
        .gte("occurred_at", winFrom).lte("occurred_at", winTo),
      supabase.from("attendance_corrections")
        .select("user_id,work_date")
        .eq("organization_id", organizationId).eq("status", "pending")
        .gte("work_date", from).lte("work_date", to),
      supabase.from("organization_holidays")
        .select("holiday_date")
        .eq("organization_id", organizationId)
        .gte("holiday_date", from).lte("holiday_date", to),
      supabase.from("attendance_days")
        .select("user_id,work_date,status")
        .eq("organization_id", organizationId)
        .gte("work_date", from).lte("work_date", to),
      supabase.from("attendance_deduction_policies")
        .select("*")
        .eq("organization_id", organizationId).eq("is_active", true),
    ]);

    for (const r of [asg, evs, corr, hol, existingDays, policies]) {
      if (r.error) throw new Error(r.error.message);
    }

    const assignments = (asg.data ?? []) as AssignmentRow[];
    if (assignments.length === 0) {
      return NextResponse.json({ evaluated: 0, proposalsCreated: 0 });
    }

    const shiftIds = [...new Set(assignments.map((a) => a.shift_id))];
    const { data: shifts } = await supabase.from("shifts").select("*")
      .eq("organization_id", organizationId).in("id", shiftIds);
    const shiftById = new Map((shifts ?? []).map((s) => [s.id as string, s as ShiftRow]));

    const locIds = [...new Set([
      ...assignments.map((a) => a.location_id),
      ...(shifts ?? []).map((s) => s.location_id),
    ].filter(Boolean) as string[])];
    const { data: locs } = locIds.length
      ? await supabase.from("work_locations").select("*")
          .eq("organization_id", organizationId).in("id", locIds)
      : { data: [] as LocationRow[] };
    const locById = new Map((locs ?? []).map((l) => [l.id as string, l as LocationRow]));

    // الإجازات المعتمدة
    const leaves = (await new LeaveManager(supabase).list(organizationId))
      .filter((l) => l.status === "approved");
    const onLeave = (userId: string, d: string) =>
      leaves.find((l) =>
        l.employeeId === userId && toDateKey(l.startDate) <= d && toDateKey(l.endDate) >= d);

    const holidaySet = new Set((hol.data ?? []).map((h) => h.holiday_date as string));
    const pendingCorr = new Set((corr.data ?? []).map((c) => `${c.user_id}|${c.work_date}`));
    const confirmedAbsent = new Set(
      (existingDays.data ?? [])
        .filter((d) => d.status === "absent_confirmed")
        .map((d) => `${d.user_id}|${d.work_date}`),
    );

    const eventsByUser = new Map<string, EventLite[]>();
    for (const e of evs.data ?? []) {
      const list = eventsByUser.get(e.user_id) ?? [];
      list.push(e as EventLite);
      eventsByUser.set(e.user_id, list);
    }

    const policyByType = new Map(
      ((policies.data ?? []) as DeductionPolicy[]).map((p) => [p.incident_type, p]),
    );

    type Row = {
      organization_id: string; user_id: string; work_date: string;
      assignment_id: string; shift_id: string; location_id: string | null;
      scheduled_start: string; scheduled_end: string; scheduled_minutes: number;
      check_in_at: string | null; check_out_at: string | null;
      status: string; late_minutes: number; early_leave_minutes: number;
      worked_minutes: number | null; leave_request_id: string | null;
      evaluated_at: string; evaluator_version: number;
    };
    const rows: Row[] = [];
    const scheduleByKey = new Map<string, { scheduledMinutes: number }>();

    for (const a of assignments) {
      const shift = shiftById.get(a.shift_id);
      if (!shift) continue;
      const loc = locById.get(a.location_id ?? shift.location_id ?? "") ?? null;

      for (const d of days) {
        if (!assignmentCovers(a, d)) continue;
        const s = buildSchedule(a, shift, loc, d);
        if (!s) continue;

        const leave = onLeave(a.user_id, d);
        const { checkIn, checkOut } = pickEffectiveEvents(eventsByUser.get(a.user_id) ?? [], s);
        const key = `${a.user_id}|${d}`;

        const ev = evaluateDay({
          schedule: s, checkIn, checkOut, now,
          onApprovedLeave: Boolean(leave),
          isHoliday: holidaySet.has(d),
          hasPendingCorrection: pendingCorr.has(key),
          absenceConfirmed: confirmedAbsent.has(key),
        });

        scheduleByKey.set(key, { scheduledMinutes: s.scheduledMinutes });
        rows.push({
          organization_id: organizationId,
          user_id: a.user_id,
          work_date: d,
          assignment_id: a.id,
          shift_id: shift.id,
          location_id: loc?.id ?? null,
          scheduled_start: new Date(s.start).toISOString(),
          scheduled_end: new Date(s.end).toISOString(),
          scheduled_minutes: s.scheduledMinutes,
          check_in_at: checkIn ? new Date(checkIn).toISOString() : null,
          check_out_at: checkOut ? new Date(checkOut).toISOString() : null,
          status: ev.status,
          late_minutes: ev.lateMinutes,
          early_leave_minutes: ev.earlyLeaveMinutes,
          worked_minutes: ev.workedMinutes,
          leave_request_id: leave?.id ?? null,
          evaluated_at: new Date().toISOString(),
          evaluator_version: 1,
        });
      }
    }

    if (rows.length === 0) return NextResponse.json({ evaluated: 0, proposalsCreated: 0 });

    const { data: saved, error: upErr } = await supabase
      .from("attendance_days")
      .upsert(rows, { onConflict: "organization_id,user_id,work_date" })
      .select("id,user_id,work_date,status,late_minutes,early_leave_minutes,check_in_at,check_out_at,scheduled_start,scheduled_end");
    if (upErr) throw new Error(upErr.message);

    // ---- مقترحات الخصم (تأخير / انصراف مبكر) ----
        // ---- مقترحات الخصم (تأخير / انصراف مبكر) ----
    const OPEN = ["needs_review", "in_review", "needs_extra_approval"];
    const chunk = <T,>(arr: T[], size: number): T[][] => {
      const out: T[][] = [];
      for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
      return out;
    };

    const savedDays = saved ?? [];
    const dayIds = savedDays.map((d) => d.id as string);

    const existingProps: {
      id: string; user_id: string; attendance_day_id: string; incident_type: string; status: string;
    }[] = [];
    for (const ids of chunk(dayIds, 100)) {
      const { data, error: epErr } = await supabase
        .from("attendance_deduction_proposals")
        .select("id,user_id,attendance_day_id,incident_type,status")
        .eq("organization_id", organizationId)
        .in("attendance_day_id", ids);
      if (epErr) throw new Error(epErr.message);
      existingProps.push(...(data ?? []));
    }
    const existingByKey = new Map(
      existingProps.map((p) => [`${p.attendance_day_id}|${p.incident_type}`, p]),
    );

    const userIds = [...new Set(savedDays.map((d) => d.user_id as string))];
    const { data: emps } = userIds.length
      ? await supabase
          .from("payroll_employees")
          .select("id,user_id,basic_salary,housing_allowance,other_allowances")
          .eq("organization_id", organizationId).in("user_id", userIds)
      : { data: [] as any[] };
    const empByUser = new Map((emps ?? []).map((e) => [e.user_id as string, e]));

    const wanted = new Set<string>();
    const toInsert: Record<string, unknown>[] = [];
    let proposalsCreated = 0;
    let proposalsUpdated = 0;

    for (const day of savedDays) {
      const incidents: { type: IncidentType; minutes: number; actualAt: string | null }[] = [];
      if (day.late_minutes > 0) {
        incidents.push({ type: "late", minutes: day.late_minutes, actualAt: day.check_in_at });
      }
      if (day.early_leave_minutes > 0) {
        incidents.push({ type: "early_leave", minutes: day.early_leave_minutes, actualAt: day.check_out_at });
      }
      if (["on_leave", "correction_pending"].includes(day.status)) continue;

      for (const inc of incidents) {
        const emp = empByUser.get(day.user_id) ?? null;
        const outcome = calculateProposal({
          incidentType: inc.type,
          minutes: inc.minutes,
          scheduledMinutes: scheduleByKey.get(`${day.user_id}|${day.work_date}`)?.scheduledMinutes ?? 0,
          policy: policyByType.get(inc.type) ?? null,
          wage: emp,
        });
        if (outcome.kind === "skip") continue;

        const key = `${day.id}|${inc.type}`;
        wanted.add(key);

        const fields = {
          payroll_employee_id: emp?.id ?? null,
          actual_at: inc.actualAt,
          minutes: inc.minutes,
          policy_id: policyByType.get(inc.type)?.id ?? null,
          calc_method: outcome.method,
          calc_inputs: outcome.inputs,
          explanation: outcome.explanation,
          original_amount: outcome.amount,
        };

        const existing = existingByKey.get(key);
        if (!existing) {
          toInsert.push({
            organization_id: organizationId,
            user_id: day.user_id,
            attendance_day_id: day.id,
            incident_type: inc.type,
            incident_date: day.work_date,
            scheduled_start: day.scheduled_start,
            status: "needs_review",
            ...fields,
          });
        } else if (OPEN.includes(existing.status)) {
          const { error: updErr } = await supabase
            .from("attendance_deduction_proposals")
            .update({ ...fields, updated_at: new Date().toISOString() })
            .eq("id", existing.id).eq("organization_id", organizationId)
            .in("status", OPEN);
          if (updErr) throw new Error(updErr.message);
          proposalsUpdated += 1;
        }
        // مقترح مُقرَّر عليه: لا يُلمس أبدًا
      }
    }

    if (toInsert.length > 0) {
      const { data: created, error: pErr } = await supabase
        .from("attendance_deduction_proposals")
        .upsert(toInsert, {
          onConflict: "organization_id,attendance_day_id,incident_type",
          ignoreDuplicates: true,
        })
        .select("id");
      if (pErr) throw new Error(pErr.message);
      proposalsCreated = created?.length ?? 0;
    }

    // واقعة لم تعد قائمة (مثلًا بعد تصحيح معتمد): نرفض المقترح المفتوح، إلا إذا كان صاحبه هو المُقيِّم نفسه
    for (const p of existingProps) {
      if (p.incident_type === "absence") continue;
      if (!OPEN.includes(p.status) || wanted.has(`${p.attendance_day_id}|${p.incident_type}`)) continue;
      if (p.user_id === user.id) continue;
      await supabase
        .from("attendance_deduction_proposals")
        .update({
          status: "rejected",
          decided_by: user.id,
          decided_at: new Date().toISOString(),
          decision_note: "Incident no longer applies after re-evaluation.",
          updated_at: new Date().toISOString(),
        })
        .eq("id", p.id).eq("organization_id", organizationId).in("status", OPEN);
    }

    await supabase.from("attendance_audit_log").insert({
      organization_id: organizationId,
      actor_id: user.id,
      action: "attendance.evaluate",
      entity_type: "attendance_days",
      after_data: { from, to, evaluated: rows.length, proposalsCreated, proposalsUpdated },
    });

    return NextResponse.json({ evaluated: rows.length, proposalsCreated, proposalsUpdated });
  } catch (error) {
    console.error("Attendance evaluation failed:", error);
    return NextResponse.json({ error: "Unable to evaluate attendance." }, { status: 500 });
  }
}