export type SchedulingRecurringDefinition = {
  intervalMs: number;
  enabled: boolean;
};

export function createRecurringSchedule(
  intervalMs: number,
): SchedulingRecurringDefinition {
  return {
    intervalMs,
    enabled: true,
  };
}

export function disableRecurringSchedule(
  schedule: SchedulingRecurringDefinition,
): SchedulingRecurringDefinition {
  return {
    ...schedule,
    enabled: false,
  };
}