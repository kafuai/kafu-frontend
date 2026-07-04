import { AIAgentOperationRuntimeResult } from "./aiAgentOperationRuntime";

export interface AIAgentOperationReport {
  operationId: string;
  status: "healthy" | "attention_required";
  summary: string;
  totalTasks: number;
  assignedTasks: number;
  blockedTasks: number;
  assignmentRate: number;
  startedAt: Date;
  completedAt: Date;
}

export function createAIAgentOperationReport(
  result: AIAgentOperationRuntimeResult,
): AIAgentOperationReport {
  const assignmentRate =
    result.totalTasks === 0 ? 0 : result.assignedTasks / result.totalTasks;

  return {
    operationId: result.operationId,
    status: result.isOperational ? "healthy" : "attention_required",
    summary: result.isOperational
      ? "All AI agent operation tasks were assigned successfully."
      : `${result.blockedTasks} AI agent operation task(s) require attention.`,
    totalTasks: result.totalTasks,
    assignedTasks: result.assignedTasks,
    blockedTasks: result.blockedTasks,
    assignmentRate,
    startedAt: result.startedAt,
    completedAt: result.completedAt,
  };
}