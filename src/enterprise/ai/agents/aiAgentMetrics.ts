import { AIAgentExecution } from "./aiAgentExecution";

export interface AIAgentExecutionMetrics {
  totalExecutions: number;
  queued: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  successRate: number;
}

export function calculateAIAgentExecutionMetrics(
  executions: readonly AIAgentExecution[],
): AIAgentExecutionMetrics {
  const metrics: AIAgentExecutionMetrics = {
    totalExecutions: executions.length,
    queued: 0,
    running: 0,
    completed: 0,
    failed: 0,
    cancelled: 0,
    successRate: 0,
  };

  for (const execution of executions) {
    metrics[execution.status]++;
  }

  metrics.successRate =
    metrics.totalExecutions === 0
      ? 0
      : metrics.completed / metrics.totalExecutions;

  return metrics;
}