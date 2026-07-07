export interface AISimulationEnvironment {
  id: string;
  scenarioId: string;
  name: string;
  organizationContext: string;
  marketContext: string;
  operationalContext: string;
  availableResources: string[];
  knownLimitations: string[];
}

export function summarizeAISimulationEnvironment(
  environment: AISimulationEnvironment,
): string {
  return [
    environment.organizationContext,
    environment.marketContext,
    environment.operationalContext,
  ]
    .filter(Boolean)
    .join(" | ");
}
