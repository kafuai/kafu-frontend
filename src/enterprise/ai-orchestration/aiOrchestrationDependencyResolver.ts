import {
  AIOrchestrationExecution,
  AIOrchestrationExecutionStepState,
} from "./aiOrchestrationExecution";
import { AIOrchestrationStep } from "./aiOrchestrationTypes";

export interface AIOrchestrationDependencyResolution {
  stepId: string;
  ready: boolean;
  blockedBy: string[];
}

export function resolveAIOrchestrationStepDependencies(
  step: AIOrchestrationStep,
  execution: AIOrchestrationExecution,
): AIOrchestrationDependencyResolution {
  const completedStepIds = new Set(
    execution.stepStates
      .filter((state) => state.status === "completed")
      .map((state) => state.stepId),
  );

  const blockedBy = step.dependencies
    .filter((dependency) => dependency.required)
    .filter((dependency) => !completedStepIds.has(dependency.stepId))
    .map((dependency) => dependency.stepId);

  return {
    stepId: step.id,
    ready: blockedBy.length === 0,
    blockedBy,
  };
}

export function getReadyAIOrchestrationSteps(
  steps: AIOrchestrationStep[],
  execution: AIOrchestrationExecution,
): AIOrchestrationStep[] {
  const stateByStepId = new Map<string, AIOrchestrationExecutionStepState>(
    execution.stepStates.map((state) => [state.stepId, state]),
  );

  return steps.filter((step) => {
    const state = stateByStepId.get(step.id);

    if (!state || state.status !== "pending") {
      return false;
    }

    return resolveAIOrchestrationStepDependencies(step, execution).ready;
  });
}

export function markBlockedAIOrchestrationSteps(
  steps: AIOrchestrationStep[],
  execution: AIOrchestrationExecution,
): AIOrchestrationExecution {
  const readyStepIds = new Set(
    getReadyAIOrchestrationSteps(steps, execution).map((step) => step.id),
  );

  return {
    ...execution,
    stepStates: execution.stepStates.map((state) => {
      if (state.status !== "pending") {
        return state;
      }

      return readyStepIds.has(state.stepId)
        ? {
            ...state,
            status: "ready",
          }
        : {
            ...state,
            status: "blocked",
          };
    }),
    updatedAt: new Date(),
  };
}