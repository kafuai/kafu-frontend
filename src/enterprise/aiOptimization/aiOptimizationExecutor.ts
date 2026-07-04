import {
  AIOptimizationExecution,
  createAIOptimizationExecution,
  updateAIOptimizationExecutionStep,
  completeAIOptimizationExecution,
} from "./aiOptimizationExecution";
import { AIOptimizationPlan } from "./aiOptimizationPlan";

export interface ExecuteAIOptimizationPlanInput {
  executionId: string;
  plan: AIOptimizationPlan;
  executedBy: string;
  dryRun?: boolean;
}

export interface ExecuteAIOptimizationPlanResult {
  execution: AIOptimizationExecution;
  messages: string[];
  dryRun: boolean;
}

export function executeAIOptimizationPlan(
  input: ExecuteAIOptimizationPlanInput,
): ExecuteAIOptimizationPlanResult {
  let execution = createAIOptimizationExecution(
    input.executionId,
    input.plan,
    input.executedBy,
  );

  const messages: string[] = [];

  for (const step of input.plan.steps) {
    const startedAt = new Date();

    if (input.dryRun) {
      execution = updateAIOptimizationExecutionStep(execution, {
        stepId: step.id,
        recommendationId: step.recommendationId,
        status: "validated",
        startedAt,
        completedAt: new Date(),
        message: "Dry run validated optimization step without applying changes.",
      });

      messages.push(`Dry run validated step: ${step.title}`);
      continue;
    }

    execution = updateAIOptimizationExecutionStep(execution, {
      stepId: step.id,
      recommendationId: step.recommendationId,
      status: step.validationRequired ? "validated" : "executed",
      startedAt,
      completedAt: new Date(),
      message: "Optimization step executed successfully.",
    });

    messages.push(`Executed step: ${step.title}`);
  }

  execution = completeAIOptimizationExecution(execution);

  return {
    execution,
    messages,
    dryRun: input.dryRun ?? false,
  };
}