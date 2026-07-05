import type { WorkQueueItem } from "./workQueue";

export class WorkQueueScheduler {
  schedule(
    items: readonly WorkQueueItem[],
  ): readonly WorkQueueItem[] {
    const priority: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...items].sort((a, b) => {
      const difference = priority[b.priority] - priority[a.priority];

      if (difference !== 0) {
        return difference;
      }

      return a.estimatedMinutes - b.estimatedMinutes;
    });
  }
}