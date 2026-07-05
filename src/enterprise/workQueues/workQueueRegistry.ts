import type { WorkQueue } from "./workQueue";

export class WorkQueueRegistry {
  private readonly queues = new Map<string, WorkQueue>();

  register(queue: WorkQueue): void {
    this.queues.set(queue.id, queue);
  }

  get(queueId: string): WorkQueue | undefined {
    return this.queues.get(queueId);
  }

  has(queueId: string): boolean {
    return this.queues.has(queueId);
  }

  list(): readonly WorkQueue[] {
    return Array.from(this.queues.values());
  }

  remove(queueId: string): boolean {
    return this.queues.delete(queueId);
  }
}