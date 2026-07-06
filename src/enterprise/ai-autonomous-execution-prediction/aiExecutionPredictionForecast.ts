import { AIExecutionPredictionScenario } from "./aiExecutionPredictionScenario";
import { AIExecutionPredictionScore } from "./aiExecutionPredictionTypes";
import {
  AIExecutionPredictionModel,
  calculateAIExecutionPredictionModelConfidence,
} from "./aiExecutionPredictionModel";

export type AIExecutionPredictionForecastHorizon =
  | "short_term"
  | "mid_term"
  | "long_term";

export interface AIExecutionPredictionForecast {
  id: string;
  modelId: string;
  scenarioId: string;
  horizon: AIExecutionPredictionForecastHorizon;
  expectedOutcome: string;
  probability: number;
  confidence: number;
  generatedAt: Date;
}

export function createAIExecutionPredictionForecast(
  scenario: AIExecutionPredictionScenario,
  score: AIExecutionPredictionScore,
  model: AIExecutionPredictionModel,
  horizon: AIExecutionPredictionForecastHorizon,
): AIExecutionPredictionForecast {
  const modelConfidence = calculateAIExecutionPredictionModelConfidence(model);
  const confidence = Math.min(1, (score.confidence + modelConfidence) / 2);

  return {
    id: `${scenario.id}-forecast-${horizon}`,
    modelId: model.id,
    scenarioId: scenario.id,
    horizon,
    expectedOutcome:
      score.successProbability >= score.failureProbability
        ? "execution_success_likely"
        : "execution_failure_or_delay_likely",
    probability: Math.max(
      score.successProbability,
      score.failureProbability,
      score.delayProbability,
      score.riskProbability,
    ),
    confidence,
    generatedAt: new Date(),
  };
}