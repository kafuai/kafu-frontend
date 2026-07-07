export interface AISimulationInputMetric {
  key: string;
  label: string;
  currentValue: number;
  unit: string;
  weight: number;
}

export interface AISimulationInputFactor {
  key: string;
  description: string;
  impact: number;
  uncertainty: number;
}

export interface AISimulationInput {
  scenarioId: string;
  metrics: AISimulationInputMetric[];
  factors: AISimulationInputFactor[];
  baselineSummary: string;
}

export function validateAISimulationInput(
  input: AISimulationInput,
): boolean {
  return (
    input.scenarioId.trim().length > 0 &&
    input.metrics.length > 0 &&
    input.metrics.every((metric) => metric.weight >= 0 && metric.weight <= 1) &&
    input.factors.every(
      (factor) =>
        factor.impact >= -1 &&
        factor.impact <= 1 &&
        factor.uncertainty >= 0 &&
        factor.uncertainty <= 1,
    )
  );
}
