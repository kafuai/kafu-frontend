import { AISimulationRiskLevel } from "./aiSimulationTypes";

export interface AISimulationVariantChange {
  key: string;
  description: string;
  expectedImpact: number;
  riskLevel: AISimulationRiskLevel;
}

export interface AISimulationVariant {
  id: string;
  scenarioId: string;
  name: string;
  description: string;
  changes: AISimulationVariantChange[];
  expectedOutcome: string;
}

export function createAISimulationVariant(
  variant: AISimulationVariant,
): AISimulationVariant {
  return variant;
}
