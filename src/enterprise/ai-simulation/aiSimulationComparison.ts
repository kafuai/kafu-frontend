import { AISimulationVariantResult } from "./aiSimulationEngine";
import { calculateAISimulationScore } from "./aiSimulationScoring";

export function compareAISimulationVariants(
  results: AISimulationVariantResult[],
): AISimulationVariantResult[] {
  return [...results].sort(
    (a, b) =>
      calculateAISimulationScore(b) -
      calculateAISimulationScore(a),
  );
}
