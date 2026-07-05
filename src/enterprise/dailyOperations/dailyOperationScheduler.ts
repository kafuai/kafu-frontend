import type { DailyOperation } from "./dailyOperation";

export class DailyOperationScheduler {
  schedule(
    operations: readonly DailyOperation[],
  ): readonly DailyOperation[] {
    return [...operations].sort((a, b) => {
      const priorityRank: Record<string, number> = {
        critical: 4,
        high: 3,
        medium: 2,
        low: 1,
      };

      const priorityDifference =
        priorityRank[b.priority] - priorityRank[a.priority];

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return a.estimatedMinutes - b.estimatedMinutes;
    });
  }
}