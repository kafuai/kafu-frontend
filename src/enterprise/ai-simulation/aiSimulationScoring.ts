import { AISimulationVariantResult } from "./aiSimulationEngine";

export function calculateAISimulationScore(
  result: AISimulationVariantResult,
): number {
  return Math.round(
    result.projectedScore * 0.5 +
    result.confidenceScore * 0.3 +
    (100 - result.riskScore) * 0.2,
  );
}
