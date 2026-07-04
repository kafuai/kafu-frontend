export interface AIOrchestrationContextValue {
  key: string;
  value: unknown;
  source: string;
  sensitive: boolean;
}

export interface AIOrchestrationContext {
  organizationId: string;
  workflowId: string;
  executionId: string;
  userId: string;
  values: AIOrchestrationContextValue[];
  createdAt: Date;
}

export interface CreateAIOrchestrationContextInput {
  organizationId: string;
  workflowId: string;
  executionId: string;
  userId: string;
  values?: AIOrchestrationContextValue[];
}

export function createAIOrchestrationContext(
  input: CreateAIOrchestrationContextInput,
): AIOrchestrationContext {
  return {
    organizationId: input.organizationId,
    workflowId: input.workflowId,
    executionId: input.executionId,
    userId: input.userId,
    values: input.values ?? [],
    createdAt: new Date(),
  };
}

export function addAIOrchestrationContextValue(
  context: AIOrchestrationContext,
  value: AIOrchestrationContextValue,
): AIOrchestrationContext {
  return {
    ...context,
    values: [...context.values, value],
  };
}

export function getAIOrchestrationContextValue<T = unknown>(
  context: AIOrchestrationContext,
  key: string,
): T | undefined {
  const item = context.values.find((value) => value.key === key);

  return item?.value as T | undefined;
}