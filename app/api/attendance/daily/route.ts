import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { addDays, isDateKey } from "@/src/enterprise/business/attendance/utils/time";
import { buildSchedule, type AssignmentRow } from "@/src/enterprise/business/attendance/utils/schedule";
import { hydrate } from "@/src/enterprise/business/attendance/core/shiftResolver";
import {
  evaluateDay, pickEffectiveEvents, type EventLite,
} from "@/src/enterprise/business/attendance/core/attendanceEvaluator";
import { LeaveManager, toDateKey } from "@/src/enterprise/business/leave";

const MIN = 60_000;

/** GET ?date=YYYY-MM-DD  — كل الموظفين الذين لهم وردية في هذا اليوم (قراءة فقط) */
export async function GET(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_MANAGE);
    if ("error" in ctx) return ctx.error;
    const { supabase, organizationId } = ctx;

    const date = new URL(request.url).searchParams.get("date");
    if (!isDateKey(date)) return NextResponse.json({ error: "Invalid date." }, { status: 400 });

    const now = Date.now();
    const winFrom = new Date(Date.parse(`${addDays(date, -1)}T00:00:00Z`)).toISOString();
    const winTo = new Date(Date.parse(`${addDays(date, 3)}T00:00:00Z`)).toISOString();

    const [asg, evs, corr, hol, days] = await Promise.all([
      supabase.from("shift_assignments")
        .select("id,user_id,shift_id,location_id,effective_from,effective_to")
        .eq("organization_id", organizationId)
        .lte("effective_from", date)
        .or(`effective_to.is.null,effective_to.gte.${date}`),
      supabase.from("attendance_events")
        .select("user_id,event_type,source,occurred_at,created_at")
        .eq("organization_id", organizationId)
        .gte("occurred_at", winFrom).lte("occurred_at", winTo),
      supabase.from("attendance_corrections").select("user_id")
        .eq("organization_id", organizationId).eq("status", "pending").eq("work_date", date),
      supabase.from("organization_holidays").select("id")
        .eq("organization_id", organizationId).eq("holiday_date", date),
      supabase.from("attendance_days").select("*")
        .eq("organization_id", organizationId).eq("work_date", date),
    ]);
    for (const r of [asg, evs, corr, hol, days]) if (r.error) throw new Error(r.error.message);

    const assignments = (asg.data ?? []) as AssignmentRow[];
    const { shiftById, locById } = await hydrate(supabase, organizationId, assignments);

    const leaves = (await new LeaveManager(supabase).list(organizationId)).filter((l) => l.status === "approved");
    const onLeave = (uid: string) =>
      leaves.some((l) => l.employeeId === uid && toDateKey(l.startDate) <= date && toDateKey(l.endDate) >= date);

    const isHoliday = (hol.data ?? []).length > 0;
    const pendingCorr = new Set((corr.data ?? []).map((c) => c.user_id as string));
    const stored = new Map((days.data ?? []).map((d) => [d.user_id as string, d]));

    const eventsByUser = new Map<string, EventLite[]>();
    for (const e of evs.data ?? []) {
      const list = eventsByUser.get(e.user_id) ?? [];
      list.push(e as EventLite);
      eventsByUser.set(e.user_id, list);
    }

    type Row = {
      userId: string; shiftName: string | null; scheduledStart: string | null; scheduledEnd: string | null;
      timezone: string; status: string; checkIn: string | null; checkOut: string | null;
      lateMinutes: number; lateIsRunning: boolean; earlyLeaveMinutes: number; workedMinutes: number | null;
      dayId: string | null;
    };
    const rows = new Map<string, Row>();

    for (const a of assignments) {
      const shift = shiftById.get(a.shift_id);
      if (!shift) continue;
      const loc = locById.get(a.location_id ?? shift.location_id ?? "") ?? null;
      const s = buildSchedule(a, shift, loc, date);
      if (!s) continue;

      const { checkIn, checkOut } = pickEffectiveEvents(eventsByUser.get(a.user_id) ?? [], s);
      const st = stored.get(a.user_id);

      const ev = evaluateDay({
        schedule: s, checkIn, checkOut, now,
        onApprovedLeave: onLeave(a.user_id),
        isHoliday,
        hasPendingCorrection: pendingCorr.has(a.user_id),
        absenceConfirmed: st?.status === "absent_confirmed",
      });

      let status: string = ev.status;
      let late = ev.lateMinutes;
      let running = false;

      if (status === "scheduled" && checkIn === null) {
        status = "not_yet";
        // تأخير جارٍ (عرض فقط، لا يُنشئ خصمًا)
        if (now > s.start + s.graceMinutes * MIN && now <= s.end) {
          late = Math.floor((now - s.start) / MIN);
          running = true;
        }
      }

      rows.set(a.user_id, {
        userId: a.user_id, shiftName: shift.name,
        scheduledStart: new Date(s.start).toISOString(), scheduledEnd: new Date(s.end).toISOString(),
        timezone: s.timezone, status,
        checkIn: checkIn ? new Date(checkIn).toISOString() : null,
        checkOut: checkOut ? new Date(checkOut).toISOString() : null,
        lateMinutes: late, lateIsRunning: running,
        earlyLeaveMinutes: ev.earlyLeaveMinutes, workedMinutes: ev.workedMinutes,
        dayId: st?.id ?? null,
      });
    }

    // سجلات محفوظة لموظفين لم تعد ورديتهم فعالة (حفاظًا على التاريخ)
    for (const [uid, d] of stored) {
      if (rows.has(uid)) continue;
      rows.set(uid, {
        userId: uid, shiftName: shiftById.get(d.shift_id)?.name ?? null,
        scheduledStart: d.scheduled_start, scheduledEnd: d.scheduled_end, timezone: "Asia/Riyadh",
        status: d.status, checkIn: d.check_in_at, checkOut: d.check_out_at,
        lateMinutes: d.late_minutes, lateIsRunning: false, earlyLeaveMinutes: d.early_leave_minutes,
        workedMinutes: d.worked_minutes, dayId: d.id,
      });
    }

    const userIds = [...rows.keys()];

    const { data: emps } = userIds.length
      ? await supabase.from("payroll_employees")
          .select("user_id,full_name,employee_number,department")
          .eq("organization_id", organizationId).in("user_id", userIds)
      : { data: [] as any[] };
    const empByUser = new Map((emps ?? []).map((e) => [e.user_id as string, e]));

    const names = new Map<string, string>();
    if (userIds.length) {
      const { data: profs } = await createSupabaseAdminClient()
        .from("profiles").select("id,full_name,email").in("id", userIds);
      for (const p of profs ?? []) names.set(p.id, p.full_name?.trim() || p.email || p.id);
    }

    const dayIds = [...rows.values()].map((r) => r.dayId).filter(Boolean) as string[];
    const proposals = new Map<string, any[]>();
    for (let i = 0; i < dayIds.length; i += 100) {
      const { data: props } = await supabase.from("attendance_deduction_proposals")
        .select("id,attendance_day_id,incident_type,status,original_amount,final_amount")
        .eq("organization_id", organizationId).in("attendance_day_id", dayIds.slice(i, i + 100));
      for (const p of props ?? []) {
        const list = proposals.get(p.attendance_day_id) ?? [];
        list.push(p);
        proposals.set(p.attendance_day_id, list);
      }
    }

    const data = [...rows.values()]
      .map((r) => {
        const e = empByUser.get(r.userId);
        return {
          ...r,
          name: e?.full_name?.trim() || names.get(r.userId) || r.userId,
          employeeNumber: e?.employee_number ?? null,
          department: e?.department ?? null,
          proposals: r.dayId ? proposals.get(r.dayId) ?? [] : [],
        };
      })
      .sort((x, y) => x.name.localeCompare(y.name));

    return NextResponse.json({ date, data });
  } catch (e) {
    console.error("Attendance daily load failed:", e);
    return NextResponse.json({ error: "Unable to load the daily attendance." }, { status: 500 });
  }
}