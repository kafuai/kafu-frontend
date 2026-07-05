import type { WorkQueue } from "./workQueue";

export interface WorkQueueMetrics {
  readonly queueCount: number;
  readonly itemCount: number;
  readonly estimatedMinutes: number;
}

export function calculateWorkQueueMetrics(
  queues: readonly WorkQueue[],
): WorkQueueMetrics {
  return {
    queueCount: queues.length,
    itemCount: queues.reduce(
      (total, queue) => total + queue.items.length,
      0,
    ),
    estimatedMinutes: queues.reduce(
      (total, queue) =>
        total +
        queue.items.reduce(
          (sum, item) => sum + item.estimatedMinutes,
          0,
        ),
      0,
    ),
  };
}