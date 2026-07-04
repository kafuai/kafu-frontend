export interface AIOrchestrationStepResult {
  stepId: string;
  success: boolean;
  outputs: Record<string, unknown>;
  warnings: string[];
  errors: string[];
  durationMs: number;
}

export interface AIOrchestrationResult {
  executionId: string;
  workflowId: string;
  organizationId: string;
  success: boolean;
  startedAt: Date;
  completedAt?: Date;
  stepResults: AIOrchestrationStepResult[];
}

export function createAIOrchestrationResult(
  executionId: string,
  workflowId: string,
  organizationId: string,
): AIOrchestrationResult {
  return {
    executionId,
    workflowId,
    organizationId,
    success: true,
    startedAt: new Date(),
    stepResults: [],
  };
}

export function addAIOrchestrationStepResult(
  result: AIOrchestrationResult,
  stepResult: AIOrchestrationStepResult,
): AIOrchestrationResult {
  return {
    ...result,
    success: result.success && stepResult.success,
    stepResults: [...result.stepResults, stepResult],
  };
}

export function completeAIOrchestrationResult(
  result: AIOrchestrationResult,
): AIOrchestrationResult {
  return {
    ...result,
    completedAt: new Date(),
  };
}