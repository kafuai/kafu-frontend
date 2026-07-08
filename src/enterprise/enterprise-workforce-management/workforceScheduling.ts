export interface WorkforceSchedule {
  employeeId: string;
  shifts: string[];
  startDate: string;
  endDate: string;
}

export function hasSchedule(
  schedule: WorkforceSchedule
): boolean {
  return schedule.shifts.length > 0;
}

export function scheduleDuration(
  schedule: WorkforceSchedule
): number {
  const start = new Date(schedule.startDate);
  const end = new Date(schedule.endDate);

  return Math.ceil(
    (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );
}
