import type { FPAForecast } from "./fpaForecast";
import { calculateForecastConfidence } from "./fpaForecast";

export interface FPADecisionRecommendation {
  confidence: number;
  recommendation: string;
}

export function generateRecommendation(forecast: FPAForecast): FPADecisionRecommendation {
  const confidence = calculateForecastConfidence(forecast);

  return {
    confidence,
    recommendation: confidence >= 85 ? "Proceed" : confidence >= 70 ? "Review" : "Reforecast",
  };
}
