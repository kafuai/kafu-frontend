import { AIOrchestrationExecution } from "./aiOrchestrationExecution";
import { AIOrchestrationResult } from "./aiOrchestrationResult";

export interface AIOrchestrationMetrics {
  executionId: string;
  workflowId: string;
  organizationId: string;
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  skippedSteps: number;
  successRate: number;
  totalDurationMs: number;
  averageStepDurationMs: number;
}

export function calculateAIOrchestrationMetrics(
  execution: AIOrchestrationExecution,
  result: AIOrchestrationResult,
): AIOrchestrationMetrics {
  const totalSteps = execution.stepStates.length;
  const completedSteps = execution.stepStates.filter(
    (step) => step.status === "completed",
  ).length;
  const failedSteps = execution.stepStates.filter(
    (step) => step.status === "failed",
  ).length;
  const skippedSteps = execution.stepStates.filter(
    (step) => step.status === "skipped",
  ).length;

  const totalDurationMs = result.stepResults.reduce(
    (total, step) => total + step.durationMs,
    0,
  );

  return {
    executionId: execution.id,
    workflowId: execution.workflowId,
    organizationId: execution.organizationId,
    totalSteps,
    completedSteps,
    failedSteps,
    skippedSteps,
    successRate: totalSteps === 0 ? 1 : completedSteps / totalSteps,
    totalDurationMs,
    averageStepDurationMs:
      result.stepResults.length === 0
        ? 0
        : totalDurationMs / result.stepResults.length,
  };
}