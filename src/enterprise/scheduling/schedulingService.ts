import { SchedulingExecutionEngine } from "./schedulingExecutionEngine";
import { SchedulingJobHistory } from "./schedulingJobHistory";
import { SchedulingJobRegistry } from "./schedulingJobRegistry";
import { SchedulingQueue } from "./schedulingQueue";
import {
  SchedulingExecutionResult,
  SchedulingJobPayload,
} from "./schedulingTypes";

export class SchedulingService {
  constructor(
    private readonly registry: SchedulingJobRegistry,
    private readonly queue: SchedulingQueue,
    private readonly engine: SchedulingExecutionEngine,
    private readonly history: SchedulingJobHistory,
  ) {}

  enqueue(payload: SchedulingJobPayload): SchedulingJobPayload {
    const job = this.registry.get(payload.jobId);

    if (!job) {
      throw new Error(`Cannot enqueue unknown scheduling job: ${payload.jobId}`);
    }

    if (job.status !== "active") {
      throw new Error(`Cannot enqueue inactive scheduling job: ${payload.jobId}`);
    }

    this.queue.enqueue(payload);
    return payload;
  }

  runNext(): SchedulingExecutionResult | undefined {
    const payload = this.queue.dequeue();

    if (!payload) {
      return undefined;
    }

    const result = this.engine.execute(payload);
    this.history.record(result);

    return result;
  }

  runAll(): SchedulingExecutionResult[] {
    const results: SchedulingExecutionResult[] = [];

    while (!this.queue.isEmpty()) {
      const result = this.runNext();

      if (result) {
        results.push(result);
      }
    }

    return results;
  }
}