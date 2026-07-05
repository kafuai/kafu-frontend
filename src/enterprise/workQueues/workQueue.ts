export type WorkQueuePriority = "low" | "medium" | "high" | "critical";

export interface WorkQueueItem {
  readonly id: string;
  readonly title: string;
  readonly capability: string;
  readonly assignee?: string;
  readonly priority: WorkQueuePriority;
  readonly estimatedMinutes: number;
  readonly createdAt: string;
}

export interface WorkQueue {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly items: readonly WorkQueueItem[];
}