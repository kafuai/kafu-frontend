export interface AIOrchestrationExecutionContext {
  readonly executionId: string;
  readonly workflowId: string;
  readonly organizationId: string;
  readonly variables: Record<string, unknown>;
  readonly stepOutputs: Record<string, unknown>;
  readonly sharedMemory: Record<string, unknown>;
  readonly activeCapabilities: string[];
  readonly completedSteps: string[];
  readonly failedSteps: string[];
  readonly startedAt: Date;
  readonly updatedAt: Date;
}

export function createAIOrchestrationExecutionContext(
  executionId: string,
  workflowId: string,
  organizationId: string,
): AIOrchestrationExecutionContext {
  const now = new Date();

  return {
    executionId,
    workflowId,
    organizationId,
    variables: {},
    stepOutputs: {},
    sharedMemory: {},
    activeCapabilities: [],
    completedSteps: [],
    failedSteps: [],
    startedAt: now,
    updatedAt: now,
  };
}

export function updateExecutionVariable(
  context: AIOrchestrationExecutionContext,
  key: string,
  value: unknown,
): AIOrchestrationExecutionContext {
  return {
    ...context,
    variables: {
      ...context.variables,
      [key]: value,
    },
    updatedAt: new Date(),
  };
}
