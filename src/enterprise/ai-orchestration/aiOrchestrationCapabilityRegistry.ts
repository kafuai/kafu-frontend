import { AIOrchestrationStepType } from "./aiOrchestrationTypes";

export interface AIOrchestrationCapability {
  id: string;
  name: string;
  description: string;
  type: AIOrchestrationStepType;
  provider: string;
  version: string;
  enabled: boolean;
  supportedUseCases: string[];
  requiredContextKeys: string[];
  outputKeys: string[];
}

export interface AIOrchestrationCapabilityRegistry {
  capabilities: AIOrchestrationCapability[];
}

export function createAIOrchestrationCapabilityRegistry(
  capabilities: AIOrchestrationCapability[] = [],
): AIOrchestrationCapabilityRegistry {
  return {
    capabilities,
  };
}

export function registerAIOrchestrationCapability(
  registry: AIOrchestrationCapabilityRegistry,
  capability: AIOrchestrationCapability,
): AIOrchestrationCapabilityRegistry {
  const existing = registry.capabilities.some((item) => item.id === capability.id);

  return {
    capabilities: existing
      ? registry.capabilities.map((item) =>
          item.id === capability.id ? capability : item,
        )
      : [...registry.capabilities, capability],
  };
}

export function findAIOrchestrationCapability(
  registry: AIOrchestrationCapabilityRegistry,
  capabilityId: string,
): AIOrchestrationCapability | undefined {
  return registry.capabilities.find(
    (capability) => capability.id === capabilityId && capability.enabled,
  );
}