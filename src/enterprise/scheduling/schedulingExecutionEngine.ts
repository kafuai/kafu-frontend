import {
  SchedulingExecutionResult,
  SchedulingJobPayload,
} from "./schedulingTypes";

export class SchedulingExecutionEngine {
  execute(job: SchedulingJobPayload): SchedulingExecutionResult {
    const startedAt = new Date();

    return {
      executionId: crypto.randomUUID(),
      jobId: job.jobId,
      status: "completed",
      startedAt,
      completedAt: new Date(),
      attempts: 1,
    };
  }
}