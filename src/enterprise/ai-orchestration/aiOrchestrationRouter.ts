import {
  AIOrchestrationCapability,
  AIOrchestrationCapabilityRegistry,
} from "./aiOrchestrationCapabilityRegistry";
import { AIOrchestrationContext } from "./aiOrchestrationContext";
import { AIOrchestrationStep } from "./aiOrchestrationTypes";

export interface AIOrchestrationRouteDecision {
  stepId: string;
  capabilityId?: string;
  routed: boolean;
  reason: string;
  missingContextKeys: string[];
}

export function routeAIOrchestrationStep(
  step: AIOrchestrationStep,
  context: AIOrchestrationContext,
  registry: AIOrchestrationCapabilityRegistry,
): AIOrchestrationRouteDecision {
  const capability = registry.capabilities.find(
    (item) =>
      item.id === step.capability &&
      item.type === step.type &&
      item.enabled,
  );

  if (!capability) {
    return {
      stepId: step.id,
      routed: false,
      reason: "No enabled capability matched the step requirement.",
      missingContextKeys: [],
    };
  }

  const contextKeys = new Set(context.values.map((value) => value.key));
  const missingContextKeys = capability.requiredContextKeys.filter(
    (key) => !contextKeys.has(key),
  );

  if (missingContextKeys.length > 0) {
    return {
      stepId: step.id,
      capabilityId: capability.id,
      routed: false,
      reason: "Required orchestration context is missing.",
      missingContextKeys,
    };
  }

  return {
    stepId: step.id,
    capabilityId: capability.id,
    routed: true,
    reason: "Step routed successfully.",
    missingContextKeys: [],
  };
}

export function rankAIOrchestrationCapabilities(
  step: AIOrchestrationStep,
  capabilities: AIOrchestrationCapability[],
): AIOrchestrationCapability[] {
  return [...capabilities]
    .filter((capability) => capability.type === step.type && capability.enabled)
    .sort((left, right) => {
      const leftUseCaseScore = left.supportedUseCases.includes(step.capability)
        ? 1
        : 0;
      const rightUseCaseScore = right.supportedUseCases.includes(step.capability)
        ? 1
        : 0;

      return rightUseCaseScore - leftUseCaseScore;
    });
}