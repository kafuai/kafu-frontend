import {
  AIOrchestrationExecutionStatus,
  AIOrchestrationStepStatus,
} from "./aiOrchestrationTypes";

export interface AIOrchestrationExecutionStepState {
  stepId: string;
  status: AIOrchestrationStepStatus;
  startedAt?: Date;
  completedAt?: Date;
  errorMessage?: string;
  attempts: number;
}

export interface AIOrchestrationExecution {
  id: string;
  organizationId: string;
  workflowId: string;
  status: AIOrchestrationExecutionStatus;
  requestedBy: string;
  objective: string;
  stepStates: AIOrchestrationExecutionStepState[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIOrchestrationExecutionInput {
  id: string;
  organizationId: string;
  workflowId: string;
  requestedBy: string;
  objective: string;
  stepIds: string[];
}

export function createAIOrchestrationExecution(
  input: CreateAIOrchestrationExecutionInput,
): AIOrchestrationExecution {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    workflowId: input.workflowId,
    status: "queued",
    requestedBy: input.requestedBy,
    objective: input.objective,
    stepStates: input.stepIds.map((stepId) => ({
      stepId,
      status: "pending",
      attempts: 0,
    })),
    createdAt: now,
    updatedAt: now,
  };
}

export function updateAIOrchestrationExecutionStatus(
  execution: AIOrchestrationExecution,
  status: AIOrchestrationExecutionStatus,
): AIOrchestrationExecution {
  return {
    ...execution,
    status,
    updatedAt: new Date(),
  };
}

export function updateAIOrchestrationStepState(
  execution: AIOrchestrationExecution,
  stepState: AIOrchestrationExecutionStepState,
): AIOrchestrationExecution {
  return {
    ...execution,
    stepStates: execution.stepStates.map((current) =>
      current.stepId === stepState.stepId ? stepState : current,
    ),
    updatedAt: new Date(),
  };
}