import {
  AIOrchestrationGuardrail,
  AIOrchestrationPriority,
  AIOrchestrationStep,
  AIOrchestrationStepDependency,
  AIOrchestrationStepType,
} from "./aiOrchestrationTypes";

export interface CreateAIOrchestrationStepInput {
  id: string;
  workflowId: string;
  name: string;
  description: string;
  type: AIOrchestrationStepType;
  capability: string;
  dependencies?: AIOrchestrationStepDependency[];
  guardrails?: AIOrchestrationGuardrail[];
  timeoutMs?: number;
  retryLimit?: number;
  requiredHumanApproval?: boolean;
  priority?: AIOrchestrationPriority;
}

export function createAIOrchestrationStep(
  input: CreateAIOrchestrationStepInput,
): AIOrchestrationStep {
  return {
    id: input.id,
    workflowId: input.workflowId,
    name: input.name,
    description: input.description,
    type: input.type,
    capability: input.capability,
    dependencies: input.dependencies ?? [],
    guardrails: input.guardrails ?? [],
    timeoutMs: input.timeoutMs,
    retryLimit: input.retryLimit,
    requiredHumanApproval: input.requiredHumanApproval ?? false,
    priority: input.priority ?? "normal",
  };
}

export function createAIModelStep(
  input: Omit<CreateAIOrchestrationStepInput, "type">,
): AIOrchestrationStep {
  return createAIOrchestrationStep({
    ...input,
    type: "model",
  });
}

export function createAIToolStep(
  input: Omit<CreateAIOrchestrationStepInput, "type">,
): AIOrchestrationStep {
  return createAIOrchestrationStep({
    ...input,
    type: "tool",
  });
}

export function createAIDecisionStep(
  input: Omit<CreateAIOrchestrationStepInput, "type">,
): AIOrchestrationStep {
  return createAIOrchestrationStep({
    ...input,
    type: "decision",
  });
}