import { AIExecutionPredictionForecast } from "./aiExecutionPredictionForecast";
import { AIExecutionPredictionPriority } from "./aiExecutionPredictionTypes";

export type AIExecutionPredictionInsightType =
  | "opportunity"
  | "warning"
  | "risk"
  | "recommendation";

export interface AIExecutionPredictionInsight {
  id: string;
  forecastId: string;
  type: AIExecutionPredictionInsightType;
  priority: AIExecutionPredictionPriority;
  title: string;
  description: string;
  confidence: number;
  createdAt: Date;
}

export function deriveAIExecutionPredictionInsight(
  forecast: AIExecutionPredictionForecast,
): AIExecutionPredictionInsight {
  const isRisky =
    forecast.expectedOutcome === "execution_failure_or_delay_likely";

  return {
    id: `${forecast.id}-insight`,
    forecastId: forecast.id,
    type: isRisky ? "warning" : "opportunity",
    priority:
      forecast.probability >= 0.75
        ? "critical"
        : forecast.probability >= 0.6
          ? "high"
          : forecast.probability >= 0.4
            ? "medium"
            : "low",
    title: isRisky
      ? "Execution risk predicted"
      : "Execution success opportunity predicted",
    description: isRisky
      ? "The prediction engine detected elevated probability of execution failure, delay, or risk."
      : "The prediction engine detected a favorable scenario with strong success probability.",
    confidence: forecast.confidence,
    createdAt: new Date(),
  };
}