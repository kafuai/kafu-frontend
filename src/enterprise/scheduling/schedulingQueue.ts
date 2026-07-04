import { SchedulingJobPayload } from "./schedulingTypes";

export class SchedulingQueue {
  private readonly queue: SchedulingJobPayload[] = [];

  enqueue(job: SchedulingJobPayload): void {
    this.queue.push(job);
  }

  dequeue(): SchedulingJobPayload | undefined {
    return this.queue.shift();
  }

  peek(): SchedulingJobPayload | undefined {
    return this.queue[0];
  }

  size(): number {
    return this.queue.length;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  clear(): void {
    this.queue.length = 0;
  }

  list(): SchedulingJobPayload[] {
    return [...this.queue];
  }
}