import { AIExecutionPredictionScenario } from "./aiExecutionPredictionScenario";
import {
  AIExecutionPredictionRiskLevel,
  AIExecutionPredictionScore,
} from "./aiExecutionPredictionTypes";

export function scoreAIExecutionPredictionScenario(
  scenario: AIExecutionPredictionScenario,
): AIExecutionPredictionScore {
  const riskPenalty = getAIExecutionPredictionRiskPenalty(scenario.riskLevel);
  const constraintPenalty = scenario.constraints.length * 0.04;

  const successProbability = scenario.successProbability;
  const failureProbability = scenario.failureProbability;
  const delayProbability = scenario.delayProbability;
  const riskProbability = scenario.riskProbability;
  const optimizationPotential = scenario.optimizationPotential;
  const confidence = scenario.confidence;

  const total = clampAIExecutionPredictionScore(
    successProbability * 0.30 +
      optimizationPotential * 0.20 +
      confidence * 0.20 -
      failureProbability * 0.15 -
      delayProbability * 0.10 -
      riskPenalty * 0.05 -
      constraintPenalty,
  );

  return {
    successProbability,
    failureProbability,
    delayProbability,
    riskProbability,
    optimizationPotential,
    confidence,
    total,
  };
}

export function getAIExecutionPredictionRiskPenalty(
  riskLevel: AIExecutionPredictionRiskLevel,
): number {
  switch (riskLevel) {
    case "critical":
      return 1;
    case "high":
      return 0.75;
    case "medium":
      return 0.4;
    case "low":
      return 0.1;
  }
}

export function clampAIExecutionPredictionScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;

  return value;
}