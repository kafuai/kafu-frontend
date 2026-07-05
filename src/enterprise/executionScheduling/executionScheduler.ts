import type { ExecutionSchedule } from "./executionSchedule";

export class ExecutionScheduler {
  schedule(
    schedules: readonly ExecutionSchedule[],
  ): readonly ExecutionSchedule[] {
    const priorityRank: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...schedules].sort((a, b) => {
      const priorityDifference =
        priorityRank[b.priority] - priorityRank[a.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return (
        new Date(a.scheduledStartAt).getTime() -
        new Date(b.scheduledStartAt).getTime()
      );
    });
  }
}