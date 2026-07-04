import { AIOptimizationPlan } from "./aiOptimizationPlan";
import { AIOptimizationStatus } from "./aiOptimizationTypes";

export interface AIOptimizationExecutionStepResult {
  stepId: string;
  recommendationId: string;
  status: "pending" | "executed" | "validated" | "failed" | "rolled_back";
  startedAt?: Date;
  completedAt?: Date;
  message?: string;
}

export interface AIOptimizationExecution {
  id: string;
  organizationId: string;
  planId: string;
  status: AIOptimizationStatus;
  stepResults: AIOptimizationExecutionStepResult[];
  startedAt: Date;
  completedAt?: Date;
  executedBy: string;
}

export function createAIOptimizationExecution(
  id: string,
  plan: AIOptimizationPlan,
  executedBy: string,
): AIOptimizationExecution {
  return {
    id,
    organizationId: plan.organizationId,
    planId: plan.id,
    status: "in_progress",
    stepResults: plan.steps.map((step) => ({
      stepId: step.id,
      recommendationId: step.recommendationId,
      status: "pending",
    })),
    startedAt: new Date(),
    executedBy,
  };
}

export function completeAIOptimizationExecution(
  execution: AIOptimizationExecution,
): AIOptimizationExecution {
  const hasFailedStep = execution.stepResults.some((step) => step.status === "failed");

  return {
    ...execution,
    status: hasFailedStep ? "failed" : "validated",
    completedAt: new Date(),
  };
}

export function updateAIOptimizationExecutionStep(
  execution: AIOptimizationExecution,
  stepResult: AIOptimizationExecutionStepResult,
): AIOptimizationExecution {
  return {
    ...execution,
    stepResults: execution.stepResults.map((step) =>
      step.stepId === stepResult.stepId ? stepResult : step,
    ),
  };
}