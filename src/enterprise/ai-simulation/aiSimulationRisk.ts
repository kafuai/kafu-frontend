import { AISimulationVariantResult } from "./aiSimulationEngine";

export interface AISimulationRiskSummary {
  highestRisk: number;
  averageRisk: number;
}

export function summarizeAISimulationRisk(
  results: AISimulationVariantResult[],
): AISimulationRiskSummary {
  if (results.length === 0) {
    return {
      highestRisk: 0,
      averageRisk: 0,
    };
  }

  return {
    highestRisk: Math.max(...results.map((r) => r.riskScore)),
    averageRisk: Math.round(
      results.reduce((sum, r) => sum + r.riskScore, 0) / results.length,
    ),
  };
}
