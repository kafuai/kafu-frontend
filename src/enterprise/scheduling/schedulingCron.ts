export type SchedulingCronDefinition = {
  expression: string;
  timezone?: string;
};

export function createSchedulingCron(
  expression: string,
  timezone = "UTC",
): SchedulingCronDefinition {
  return {
    expression,
    timezone,
  };
}

export function isCronEnabled(
  cron: SchedulingCronDefinition,
): boolean {
  return cron.expression.trim().length > 0;
}