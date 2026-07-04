import { AIAutonomousExecutionDecisionResult } from "./aiAutonomousExecutionDecision";
import { AIAutonomousExecutionStatus } from "./aiAutonomousExecutionTypes";

export interface AIAutonomousExecutionTaskResult {
  taskId: string;
  status: "executed" | "waiting_approval" | "blocked" | "skipped";
  decision: AIAutonomousExecutionDecisionResult;
  output?: unknown;
  error?: string;
  completedAt?: Date;
}

export interface AIAutonomousExecutionResult {
  executionId: string;
  planId: string;
  organizationId: string;
  status: AIAutonomousExecutionStatus;
  taskResults: AIAutonomousExecutionTaskResult[];
  startedAt: Date;
  completedAt?: Date;
}

export function createAIAutonomousExecutionResult(
  executionId: string,
  planId: string,
  organizationId: string,
): AIAutonomousExecutionResult {
  return {
    executionId,
    planId,
    organizationId,
    status: "running",
    taskResults: [],
    startedAt: new Date(),
  };
}

export function addAIAutonomousExecutionTaskResult(
  result: AIAutonomousExecutionResult,
  taskResult: AIAutonomousExecutionTaskResult,
): AIAutonomousExecutionResult {
  return {
    ...result,
    taskResults: [...result.taskResults, taskResult],
  };
}

export function completeAIAutonomousExecutionResult(
  result: AIAutonomousExecutionResult,
  status: AIAutonomousExecutionStatus,
): AIAutonomousExecutionResult {
  return {
    ...result,
    status,
    completedAt: new Date(),
  };
}