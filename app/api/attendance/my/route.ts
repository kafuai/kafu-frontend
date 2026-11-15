import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { addDays, dateKeyInTz, dateRange, isDateKey } from "@/src/enterprise/business/attendance/utils/time";
import { buildSchedule, DEFAULT_TZ, type AssignmentRow } from "@/src/enterprise/business/attendance/utils/schedule";
import { hydrate } from "@/src/enterprise/business/attendance/core/shiftResolver";
import {
  evaluateDay, pickEffectiveEvents, type EventLite,
} from "@/src/enterprise/business/attendance/core/attendanceEvaluator";
import { LeaveManager, toDateKey } from "@/src/enterprise/business/leave";

const MIN = 60_000;
const MAX_DAYS = 62;

/** GET ?from=YYYY-MM-DD&to=YYYY-MM-DD — سجل صاحب الجلسة فقط (قراءة فقط، حتى لو كان owner) */
export async function GET(request: Request) {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const sp = new URL(request.url).searchParams;
    const from = sp.get("from");
    const to = sp.get("to");
    const today = dateKeyInTz(Date.now(), DEFAULT_TZ);

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

    const [asg, evs, corr, hol, stored] = await Promise.all([
      supabase.from("shift_assignments")
        .select("id,user_id,shift_id,location_id,effective_from,effective_to")
        .eq("organization_id", organizationId).eq("user_id", user.id)
        .lte("effective_from", to)
        .or(`effective_to.is.null,effective_to.gte.${from}`),
      supabase.from("attendance_events")
        .select("user_id,event_type,source,occurred_at,created_at")
        .eq("organization_id", organizationId).eq("user_id", user.id)
        .gte("occurred_at", winFrom).lte("occurred_at", winTo),
      supabase.from("attendance_corrections").select("work_date")
        .eq("organization_id", organizationId).eq("user_id", user.id).eq("status", "pending")
        .gte("work_date", from).lte("work_date", to),
      supabase.from("organization_holidays").select("holiday_date")
        .eq("organization_id", organizationId)
        .gte("holiday_date", from).lte("holiday_date", to),
      supabase.from("attendance_days").select("id,work_date,status")
        .eq("organization_id", organizationId).eq("user_id", user.id)
        .gte("work_date", from).lte("work_date", to),
    ]);
    for (const r of [asg, evs, corr, hol, stored]) if (r.error) throw new Error(r.error.message);

    const assignments = (asg.data ?? []) as AssignmentRow[];
    const { shiftById, locById } = await hydrate(supabase, organizationId, assignments);

    const leaves = (await new LeaveManager(supabase).list(organizationId, user.id))
      .filter((l) => l.status === "approved");
    const onLeave = (d: string) =>
      leaves.some((l) => toDateKey(l.startDate) <= d && toDateKey(l.endDate) >= d);

    const holidays = new Set((hol.data ?? []).map((h) => h.holiday_date as string));
    const pendingCorr = new Set((corr.data ?? []).map((c) => c.work_date as string));
    const storedByDate = new Map((stored.data ?? []).map((d) => [d.work_date as string, d]));
    const events = (evs.data ?? []) as EventLite[];

    const rows: any[] = [];

    for (const a of assignments) {
      const shift = shiftById.get(a.shift_id);
      if (!shift) continue;
      const loc = locById.get(a.location_id ?? shift.location_id ?? "") ?? null;

      for (const d of days) {
        const s = buildSchedule(a, shift, loc, d);
        if (!s) continue;

        const { checkIn, checkOut } = pickEffectiveEvents(events, s);
        const st = storedByDate.get(d);

        const ev = evaluateDay({
          schedule: s, checkIn, checkOut, now,
          onApprovedLeave: onLeave(d),
          isHoliday: holidays.has(d),
          hasPendingCorrection: pendingCorr.has(d),
          absenceConfirmed: st?.status === "absent_confirmed",
        });

        let status: string = ev.status;
        let late = ev.lateMinutes;
        let running = false;

        if (status === "scheduled" && checkIn === null) {
          status = "not_yet";
          if (now > s.start + s.graceMinutes * MIN && now <= s.end) {
            late = Math.floor((now - s.start) / MIN);
            running = true;
          }
        }

        rows.push({
          date: d,
          dayId: st?.id ?? null,
          shiftName: shift.name,
          timezone: s.timezone,
          scheduledStart: new Date(s.start).toISOString(),
          scheduledEnd: new Date(s.end).toISOString(),
          status,
          checkIn: checkIn ? new Date(checkIn).toISOString() : null,
          checkOut: checkOut ? new Date(checkOut).toISOString() : null,
          lateMinutes: late,
          lateIsRunning: running,
          earlyLeaveMinutes: ev.earlyLeaveMinutes,
          workedMinutes: ev.workedMinutes,
          proposals: [] as any[],
        });
      }
    }

    // مقترحات الخصم الخاصة بصاحب الجلسة فقط
    const dayIds = rows.map((r) => r.dayId).filter(Boolean) as string[];
    const byDay = new Map<string, any[]>();
    for (let i = 0; i < dayIds.length; i += 100) {
      const { data: props } = await supabase.from("attendance_deduction_proposals")
        .select("id,attendance_day_id,incident_type,status,original_amount,final_amount")
        .eq("organization_id", organizationId).eq("user_id", user.id)
        .in("attendance_day_id", dayIds.slice(i, i + 100));
      for (const p of props ?? []) {
        const list = byDay.get(p.attendance_day_id) ?? [];
        list.push(p);
        byDay.set(p.attendance_day_id, list);
      }
    }
    for (const r of rows) r.proposals = r.dayId ? byDay.get(r.dayId) ?? [] : [];

    rows.sort((x, y) => (x.date < y.date ? 1 : x.date > y.date ? -1 : 0));
    return NextResponse.json({ userId: user.id, data: rows });
  } catch (e) {
    console.error("My attendance load failed:", e);
    return NextResponse.json({ error: "Unable to load your attendance records." }, { status: 500 });
  }
}