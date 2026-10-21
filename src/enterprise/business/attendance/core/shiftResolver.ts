import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { addDays, dateKeyInTz } from "../utils/time";
import {
  buildSchedule, DEFAULT_TZ,
  type AssignmentRow, type LocationRow, type Schedule, type ShiftRow,
} from "../utils/schedule";

export type Candidate = {
  assignment: AssignmentRow;
  shift: ShiftRow;
  location: LocationRow | null;
  schedule: Schedule;
};

export async function hydrate(
  supabase: SupabaseClient, organizationId: string, assignments: AssignmentRow[],
) {
  const shiftIds = [...new Set(assignments.map((a) => a.shift_id))];
  const { data: shifts } = shiftIds.length
    ? await supabase.from("shifts").select("*").eq("organization_id", organizationId).in("id", shiftIds)
    : { data: [] as any[] };
  const shiftById = new Map((shifts ?? []).map((s) => [s.id as string, s as ShiftRow]));

  const locIds = [...new Set([
    ...assignments.map((a) => a.location_id),
    ...(shifts ?? []).map((s) => s.location_id),
  ].filter(Boolean) as string[])];
  const { data: locs } = locIds.length
    ? await supabase.from("work_locations").select("*").eq("organization_id", organizationId).in("id", locIds)
    : { data: [] as any[] };
  const locById = new Map((locs ?? []).map((l) => [l.id as string, l as LocationRow]));
  return { shiftById, locById };
}

/** جداول الموظف حول الآن (أمس، اليوم، غدًا) لكل إسناد */
export async function loadUserSchedules(
  supabase: SupabaseClient, organizationId: string, userId: string, now = Date.now(),
): Promise<{ hasAssignment: boolean; candidates: Candidate[] }> {
  const probe = dateKeyInTz(now, DEFAULT_TZ);
  const { data, error } = await supabase
    .from("shift_assignments")
    .select("id,user_id,shift_id,location_id,effective_from,effective_to")
    .eq("organization_id", organizationId).eq("user_id", userId)
    .lte("effective_from", addDays(probe, 2))
    .or(`effective_to.is.null,effective_to.gte.${addDays(probe, -2)}`);
  if (error) throw new Error(error.message);

  const assignments = (data ?? []) as AssignmentRow[];
  const { shiftById, locById } = await hydrate(supabase, organizationId, assignments);
  const candidates: Candidate[] = [];

  for (const a of assignments) {
    const shift = shiftById.get(a.shift_id);
    if (!shift) continue;
    const location = locById.get(a.location_id ?? shift.location_id ?? "") ?? null;
    const today = dateKeyInTz(now, location?.timezone || DEFAULT_TZ);
    for (const d of [addDays(today, -1), today, addDays(today, 1)]) {
      const schedule = buildSchedule(a, shift, location, d);
      if (schedule) candidates.push({ assignment: a, shift, location, schedule });
    }
  }
  candidates.sort((x, y) => x.schedule.start - y.schedule.start);
  return { hasAssignment: assignments.length > 0, candidates };
}

/** جدول الموظف ليوم محدد (للتصحيحات) */
export async function loadScheduleForDate(
  supabase: SupabaseClient, organizationId: string, userId: string, workDate: string,
): Promise<Candidate | null> {
  const { data, error } = await supabase
    .from("shift_assignments")
    .select("id,user_id,shift_id,location_id,effective_from,effective_to")
    .eq("organization_id", organizationId).eq("user_id", userId)
    .lte("effective_from", workDate)
    .or(`effective_to.is.null,effective_to.gte.${workDate}`);
  if (error) throw new Error(error.message);

  const assignments = (data ?? []) as AssignmentRow[];
  const { shiftById, locById } = await hydrate(supabase, organizationId, assignments);

  for (const a of assignments) {
    const shift = shiftById.get(a.shift_id);
    if (!shift) continue;
    const location = locById.get(a.location_id ?? shift.location_id ?? "") ?? null;
    const schedule = buildSchedule(a, shift, location, workDate);
    if (schedule) return { assignment: a, shift, location, schedule };
  }
  return null;
}

export function pickFocus(candidates: Candidate[], now: number) {
  const MIN = 60_000;
  const current = candidates
    .filter((c) => now >= c.schedule.start - c.schedule.earlyCheckinMinutes * MIN && now <= c.schedule.end)
    .sort((a, b) => Math.abs(now - a.schedule.start) - Math.abs(now - b.schedule.start))[0] ?? null;
  const next = candidates.find((c) => c.schedule.start - c.schedule.earlyCheckinMinutes * MIN > now) ?? null;
  const recent = [...candidates].reverse().find((c) => c.schedule.end < now && now - c.schedule.end < 24 * 60 * MIN) ?? null;
  return { current, next, recent };
}