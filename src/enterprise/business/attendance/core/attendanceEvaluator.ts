import { CHECKOUT_GRACE_MINUTES, type Schedule } from "../utils/schedule";

export type DayStatus =
  | "scheduled" | "present" | "late" | "early_leave" | "late_early_leave"
  | "possible_absence" | "absent_confirmed" | "incomplete"
  | "correction_pending" | "on_leave" | "holiday";

export interface DayEvaluationInput {
  schedule: Schedule;
  checkIn: number | null;
  checkOut: number | null;
  now: number;
  onApprovedLeave: boolean;
  isHoliday: boolean;
  hasPendingCorrection: boolean;
  absenceConfirmed: boolean;
}

export interface DayEvaluation {
  status: DayStatus;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  workedMinutes: number | null;
}

const MIN = 60_000;

export function evaluateDay(i: DayEvaluationInput): DayEvaluation {
  const { schedule: s, checkIn, checkOut, now } = i;
  const base = { lateMinutes: 0, earlyLeaveMinutes: 0, workedMinutes: null as number | null };

  // A holiday is a calendar context, not a replacement for actual attendance.
  // Preserve lateness/early-leave calculations when the employee actually worked.
  if (i.isHoliday && checkIn === null && checkOut === null) return { ...base, status: "holiday" };
  if (i.onApprovedLeave) return { ...base, status: "on_leave" };

  const lateMinutes =
    checkIn !== null && checkIn > s.start + s.graceMinutes * MIN
      ? Math.floor((checkIn - s.start) / MIN)
      : 0;

  if (i.hasPendingCorrection) return { ...base, lateMinutes, status: "correction_pending" };

  if (checkIn === null) {
    if (i.absenceConfirmed) return { ...base, status: "absent_confirmed" };
    // لا يُعتبر غيابًا محتملًا قبل انتهاء الوردية
    return { ...base, status: now > s.end ? "possible_absence" : "scheduled" };
  }

  if (checkOut === null) {
    if (now > s.end) return { ...base, lateMinutes, status: "incomplete" };
    return { ...base, lateMinutes, status: lateMinutes > 0 ? "late" : "present" };
  }

  const earlyLeaveMinutes = checkOut < s.end ? Math.floor((s.end - checkOut) / MIN) : 0;
  const worked = Math.max(0, Math.round((checkOut - checkIn) / MIN) - s.breakMinutes);

  let status: DayStatus = "present";
  if (lateMinutes > 0 && earlyLeaveMinutes > 0) status = "late_early_leave";
  else if (lateMinutes > 0) status = "late";
  else if (earlyLeaveMinutes > 0) status = "early_leave";

  return { status, lateMinutes, earlyLeaveMinutes, workedMinutes: worked };
}

export type EventLite = {
  event_type: "check_in" | "check_out";
  source: string;
  occurred_at: string;
  created_at: string;
};

/** أحداث التصحيح المعتمدة لها أولوية على الأحداث الأصلية. الاشتقاق من occurred_at فقط. */
export function pickEffectiveEvents(
  events: EventLite[],
  s: Schedule,
): { checkIn: number | null; checkOut: number | null } {
  const inWindowStart = s.start - s.earlyCheckinMinutes * MIN;
    const outWindowEnd = s.end + CHECKOUT_GRACE_MINUTES * MIN;
  const t = (e: EventLite) => new Date(e.occurred_at).getTime();

  const pick = (
    type: "check_in" | "check_out", from: number, to: number, mode: "first" | "last",
  ): number | null => {
    const list = events.filter((e) => e.event_type === type && t(e) >= from && t(e) <= to);
    const corrections = list.filter((e) => e.source === "correction");
    const pool = corrections.length > 0 ? corrections : list;
    if (pool.length === 0) return null;
    const times = pool.map(t).sort((a, b) => a - b);
    return mode === "first" ? times[0] : times[times.length - 1];
  };

  const checkIn = pick("check_in", inWindowStart, s.end, "first");
  const checkOut = pick("check_out", checkIn ?? s.start, outWindowEnd, "last");
  return { checkIn, checkOut };
}