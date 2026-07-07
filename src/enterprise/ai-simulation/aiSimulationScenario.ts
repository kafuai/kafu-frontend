import {
  AISimulationMetadata,
  AISimulationPriority,
  AISimulationScope,
  AISimulationStatus,
} from "./aiSimulationTypes";

export interface AISimulationScenario {
  id: string;
  name: string;
  description: string;
  scope: AISimulationScope;
  status: AISimulationStatus;
  priority: AISimulationPriority;
  objective: string;
  assumptions: string[];
  targetEntityId: string;
  targetEntityType: string;
  metadata: AISimulationMetadata;
}

export function createAISimulationScenario(
  input: Omit<AISimulationScenario, "status">,
): AISimulationScenario {
  return {
    ...input,
    status: "ready",
  };
}
