import { AIAgentOperationTaskStatus } from "./aiAgentOperationTypes";

export interface AIAgentOperationTaskResult {
  taskId: string;
  agentId?: string;
  status: AIAgentOperationTaskStatus;
  output?: Record<string, unknown>;
  error?: string;
  startedAt: Date;
  completedAt?: Date;
}

export interface AIAgentOperationResult {
  operationId: string;
  organizationId: string;
  status: "completed" | "failed" | "partial";
  taskResults: AIAgentOperationTaskResult[];
  startedAt: Date;
  completedAt?: Date;
}

export function createAIAgentOperationResult(
  operationId: string,
  organizationId: string,
): AIAgentOperationResult {
  return {
    operationId,
    organizationId,
    status: "partial",
    taskResults: [],
    startedAt: new Date(),
  };
}

export function addAIAgentOperationTaskResult(
  result: AIAgentOperationResult,
  taskResult: AIAgentOperationTaskResult,
): AIAgentOperationResult {
  return {
    ...result,
    taskResults: [...result.taskResults, taskResult],
  };
}

export function completeAIAgentOperationResult(
  result: AIAgentOperationResult,
): AIAgentOperationResult {
  const hasFailedTask = result.taskResults.some(
    (taskResult) => taskResult.status === "failed",
  );

  const hasPartialTask = result.taskResults.some(
    (taskResult) =>
      taskResult.status !== "completed" && taskResult.status !== "failed",
  );

  return {
    ...result,
    status: hasFailedTask ? "failed" : hasPartialTask ? "partial" : "completed",
    completedAt: new Date(),
  };
}