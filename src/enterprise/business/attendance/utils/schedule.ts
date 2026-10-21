import { addDays, weekdayOf, zonedTimeToUtc } from "./time";

export const DEFAULT_TZ = "Asia/Riyadh";
export const CHECKOUT_GRACE_MINUTES = 360;

export type ShiftRow = {
  id: string;
  location_id: string | null;
  name: string;
  start_time: string;
  end_time: string;
  crosses_midnight: boolean;
  work_days: number[];
  grace_minutes: number;
  break_minutes: number;
  early_checkin_minutes: number;
  is_active: boolean;
};

export type LocationRow = {
  id: string;
  name: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  geofence_radius_m: number | null;
  geofence_required: boolean;
  remote_allowed: boolean;
  is_active: boolean;
};

export type AssignmentRow = {
  id: string;
  user_id: string;
  shift_id: string;
  location_id: string | null;
  effective_from: string;
  effective_to: string | null;
};

export type Schedule = {
  workDate: string;
  start: number;
  end: number;
  graceMinutes: number;
  breakMinutes: number;
  earlyCheckinMinutes: number;
  scheduledMinutes: number;
  timezone: string;
};

export function assignmentCovers(a: AssignmentRow, dateKey: string): boolean {
  return a.effective_from <= dateKey && (a.effective_to === null || a.effective_to >= dateKey);
}

/** null إذا لم يكن اليوم يوم عمل لهذا الإسناد أو الوردية غير فعالة */
export function buildSchedule(
  a: AssignmentRow,
  shift: ShiftRow,
  location: LocationRow | null,
  workDate: string,
): Schedule | null {
  if (!shift.is_active || !assignmentCovers(a, workDate)) return null;
  if (!shift.work_days.includes(weekdayOf(workDate))) return null;

  const tz = location?.timezone || DEFAULT_TZ;
  const start = zonedTimeToUtc(workDate, shift.start_time, tz);
  const end = zonedTimeToUtc(
    shift.crosses_midnight ? addDays(workDate, 1) : workDate,
    shift.end_time,
    tz,
  );

  return {
    workDate,
    start,
    end,
    graceMinutes: shift.grace_minutes,
    breakMinutes: shift.break_minutes,
    earlyCheckinMinutes: shift.early_checkin_minutes,
    scheduledMinutes: Math.max(0, Math.round((end - start) / 60000) - shift.break_minutes),
    timezone: tz,
  };
}