import { AIRecommendationSignal } from "../types/aiRecommendationTypes";
import { calculateAIRecommendationScore } from "./aiRecommendationScoring";

export function selectTopAIRecommendationSignals(
  signals: AIRecommendationSignal[],
  limit = 5,
): AIRecommendationSignal[] {
  return [...signals]
    .sort(
      (a, b) =>
        calculateAIRecommendationScore(b) - calculateAIRecommendationScore(a),
    )
    .slice(0, limit);
}