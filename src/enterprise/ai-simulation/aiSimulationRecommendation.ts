import { AISimulationEvaluation } from "./aiSimulationEvaluator";

export interface AISimulationRecommendation {
  approved: boolean;
  message: string;
}

export function generateAISimulationRecommendation(
  evaluation: AISimulationEvaluation,
): AISimulationRecommendation {
  return {
    approved: evaluation.isRecommended,
    message: evaluation.isRecommended
      ? "Simulation outcome is recommended for execution."
      : "Simulation outcome requires additional optimization.",
  };
}
