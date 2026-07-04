import {
  SchedulingExecutionResult,
  SchedulingExecutionStatus,
} from "./schedulingTypes";

export type SchedulingMetricsSnapshot = {
  totalExecutions: number;
  completedExecutions: number;
  failedExecutions: number;
  runningExecutions: number;
  queuedExecutions: number;
  retryingExecutions: number;
};

export function createSchedulingMetricsSnapshot(
  executions: SchedulingExecutionResult[],
): SchedulingMetricsSnapshot {
  const count = (status: SchedulingExecutionStatus) =>
    executions.filter((execution) => execution.status === status).length;

  return {
    totalExecutions: executions.length,
    completedExecutions: count("completed"),
    failedExecutions: count("failed"),
    runningExecutions: count("running"),
    queuedExecutions: count("queued"),
    retryingExecutions: count("retrying"),
  };
}