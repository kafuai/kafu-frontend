import {
  AIOrchestrationExecution,
  AIOrchestrationExecutionStepState,
  updateAIOrchestrationStepState,
} from "./aiOrchestrationExecution";

export function startAIOrchestrationStep(
  execution: AIOrchestrationExecution,
  stepId: string,
): AIOrchestrationExecution {
  const current = execution.stepStates.find((state) => state.stepId === stepId);

  if (!current) {
    return execution;
  }

  const nextState: AIOrchestrationExecutionStepState = {
    ...current,
    status: "running",
    startedAt: new Date(),
    attempts: current.attempts + 1,
  };

  return updateAIOrchestrationStepState(execution, nextState);
}

export function completeAIOrchestrationStep(
  execution: AIOrchestrationExecution,
  stepId: string,
): AIOrchestrationExecution {
  const current = execution.stepStates.find((state) => state.stepId === stepId);

  if (!current) {
    return execution;
  }

  return updateAIOrchestrationStepState(execution, {
    ...current,
    status: "completed",
    completedAt: new Date(),
  });
}

export function failAIOrchestrationStep(
  execution: AIOrchestrationExecution,
  stepId: string,
  errorMessage: string,
): AIOrchestrationExecution {
  const current = execution.stepStates.find((state) => state.stepId === stepId);

  if (!current) {
    return execution;
  }

  return updateAIOrchestrationStepState(execution, {
    ...current,
    status: "failed",
    completedAt: new Date(),
    errorMessage,
  });
}

export function skipAIOrchestrationStep(
  execution: AIOrchestrationExecution,
  stepId: string,
): AIOrchestrationExecution {
  const current = execution.stepStates.find((state) => state.stepId === stepId);

  if (!current) {
    return execution;
  }

  return updateAIOrchestrationStepState(execution, {
    ...current,
    status: "skipped",
    completedAt: new Date(),
  });
}