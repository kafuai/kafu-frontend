import { AISimulationEvaluation } from "./aiSimulationEvaluator";
import { AISimulationRecommendation } from "./aiSimulationRecommendation";

export interface AISimulationReport {
  generatedAt: string;
  evaluation: AISimulationEvaluation;
  recommendation: AISimulationRecommendation;
}

export function createAISimulationReport(
  evaluation: AISimulationEvaluation,
  recommendation: AISimulationRecommendation,
): AISimulationReport {
  return {
    generatedAt: new Date().toISOString(),
    evaluation,
    recommendation,
  };
}
