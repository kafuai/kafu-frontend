import { SchedulingExecutionResult } from "./schedulingTypes";

export class SchedulingJobHistory {
  private readonly history: SchedulingExecutionResult[] = [];

  record(result: SchedulingExecutionResult): SchedulingExecutionResult {
    this.history.push(result);
    return result;
  }

  list(): SchedulingExecutionResult[] {
    return [...this.history];
  }

  listByJob(jobId: string): SchedulingExecutionResult[] {
    return this.history.filter((item) => item.jobId === jobId);
  }

  latest(jobId: string): SchedulingExecutionResult | undefined {
    return this.listByJob(jobId).at(-1);
  }

  clear(): void {
    this.history.length = 0;
  }
}