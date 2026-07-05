import type { ExecutionSchedule } from "./executionSchedule";
import type { ExecutionWindow } from "./executionWindow";

export interface ExecutionConstraint {
  readonly id: string;
  readonly name: string;
  readonly enabled: boolean;
  readonly reason: string;
}

export function canScheduleExecution(
  schedule: ExecutionSchedule,
  window: ExecutionWindow,
  constraints: readonly ExecutionConstraint[],
): boolean {
  const hasBlockingConstraint = constraints.some(
    (constraint) => constraint.enabled,
  );

  if (hasBlockingConstraint) {
    return false;
  }

  const startsInsideWindow =
    new Date(schedule.scheduledStartAt).getTime() >=
    new Date(window.startsAt).getTime();

  const endsInsideWindow =
    new Date(schedule.scheduledEndAt).getTime() <=
    new Date(window.endsAt).getTime();

  return startsInsideWindow && endsInsideWindow;
}