import "server-only";
import { NextResponse } from "next/server";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getAttendanceContext } from "@/src/enterprise/business/attendance/core/attendanceContext";
import { loadUserSchedules, pickFocus, type Candidate } from "@/src/enterprise/business/attendance/core/shiftResolver";
import { evaluateDay, pickEffectiveEvents } from "@/src/enterprise/business/attendance/core/attendanceEvaluator";
import { LeaveManager, toDateKey } from "@/src/enterprise/business/leave";
import { CHECKOUT_GRACE_MINUTES } from "@/src/enterprise/business/attendance/utils/schedule";

export async function GET() {
  try {
    const ctx = await getAttendanceContext(PERMISSIONS.ATTENDANCE_USE);
    if ("error" in ctx) return ctx.error;
    const { supabase, user, organizationId } = ctx;

    const now = Date.now();
    const { hasAssignment, candidates } = await loadUserSchedules(supabase, organizationId, user.id, now);
    if (!hasAssignment) {
      return NextResponse.json({ userId: user.id, blockedReason: "no_assignment", current: null, next: null, recent: null });
    }

    const { current, next, recent } = pickFocus(candidates, now);
    const leaves = (await new LeaveManager(supabase).list(organizationId, user.id)).filter((l) => l.status === "approved");

    const build = async (c: Candidate | null) => {
      if (!c) return null;
      const s = c.schedule;
      const from = new Date(s.start - s.earlyCheckinMinutes * 60_000).toISOString();
      const to = new Date(s.end + 6 * 3_600_000).toISOString();
      const { data: evs } = await supabase
        .from("attendance_events")
        .select("event_type,source,occurred_at,created_at")
        .eq("organization_id", organizationId).eq("user_id", user.id)
        .gte("occurred_at", from).lte("occurred_at", to);
      const { checkIn, checkOut } = pickEffectiveEvents((evs ?? []) as any, s);
      const onLeave = leaves.some((l) => toDateKey(l.startDate) <= s.workDate && toDateKey(l.endDate) >= s.workDate);
      const live = evaluateDay({
        schedule: s, checkIn, checkOut, now,
        onApprovedLeave: onLeave, isHoliday: false, hasPendingCorrection: false, absenceConfirmed: false,
      });
      return {
        shiftName: c.shift.name,
        workDate: s.workDate,
        start: new Date(s.start).toISOString(),
        end: new Date(s.end).toISOString(),
        graceMinutes: s.graceMinutes,
        timezone: s.timezone,
        workDays: c.shift.work_days,
        location: c.location
          ? { name: c.location.name, geofenceRequired: c.location.geofence_required, remoteAllowed: c.location.remote_allowed }
          : null,
        locationActive: c.location ? c.location.is_active : true,
        checkIn: checkIn ? new Date(checkIn).toISOString() : null,
        checkOut: checkOut ? new Date(checkOut).toISOString() : null,
        onLeave,
        live,
      };
    };

    const [curView, nextView, recentView] = await Promise.all([build(current), build(next), build(recent)]);

        let blockedReason: string | null = null;
    if (!curView) blockedReason = "no_active_shift";
    else if (curView.onLeave) blockedReason = "on_leave";
    else if (!curView.locationActive) blockedReason = "location_inactive";

    const GRACE_MS = CHECKOUT_GRACE_MINUTES * 60_000;
    let checkoutTarget: "current" | "recent" | null = null;
    let checkoutDeadline: string | null = null;

    if (curView && !blockedReason && curView.checkIn && !curView.checkOut) {
      checkoutTarget = "current";
    } else if (
      recent && recentView &&
      recentView.checkIn && !recentView.checkOut &&
      now <= recent.schedule.end + GRACE_MS
    ) {
      checkoutTarget = "recent";
      checkoutDeadline = new Date(recent.schedule.end + GRACE_MS).toISOString();
    }

    return NextResponse.json({
      userId: user.id,
      blockedReason,
      current: curView,
      next: nextView,
      recent: recentView,
      canCheckIn: Boolean(curView && !blockedReason && !curView.checkIn),
      canCheckOut: checkoutTarget !== null,
      checkoutTarget,
      checkoutDeadline,
    });
  } catch (error) {
    console.error("Attendance today failed:", error);
    return NextResponse.json({ error: "Unable to load attendance." }, { status: 500 });
  }
}