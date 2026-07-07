import { AISimulationEngineResult } from "./aiSimulationEngine";

export interface AISimulationEvaluation {
  scenarioId: string;
  averageProjectedScore: number;
  averageConfidenceScore: number;
  averageRiskScore: number;
  isRecommended: boolean;
}

export function evaluateAISimulationResult(
  result: AISimulationEngineResult,
): AISimulationEvaluation {
  const count = Math.max(result.variantResults.length, 1);

  const averageProjectedScore = Math.round(
    result.variantResults.reduce((total, item) => total + item.projectedScore, 0) / count,
  );

  const averageConfidenceScore = Math.round(
    result.variantResults.reduce((total, item) => total + item.confidenceScore, 0) / count,
  );

  const averageRiskScore = Math.round(
    result.variantResults.reduce((total, item) => total + item.riskScore, 0) / count,
  );

  return {
    scenarioId: result.scenarioId,
    averageProjectedScore,
    averageConfidenceScore,
    averageRiskScore,
    isRecommended: averageProjectedScore >= 65 && averageRiskScore <= 60,
  };
}
