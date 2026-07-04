import { AIExecutionDecisionOption } from "./aiExecutionDecisionOption";
import {
  AIExecutionDecisionRiskLevel,
  AIExecutionDecisionScore,
} from "./aiExecutionDecisionIntelligenceTypes";

export function scoreAIExecutionDecisionOption(
  option: AIExecutionDecisionOption,
): AIExecutionDecisionScore {
  const riskPenalty = getAIExecutionDecisionRiskPenalty(option.riskLevel);
  const constraintPenalty = option.constraints.length * 0.04;

  const confidence = option.confidence;
  const impact = option.expectedImpact;
  const urgency = option.urgency;
  const feasibility = option.feasibility;
  const risk = riskPenalty;

  const total = clampAIExecutionDecisionScore(
    confidence * 0.25 +
      impact * 0.3 +
      urgency * 0.2 +
      feasibility * 0.2 -
      riskPenalty * 0.2 -
      constraintPenalty,
  );

  return {
    confidence,
    impact,
    urgency,
    feasibility,
    risk,
    total,
  };
}

export function getAIExecutionDecisionRiskPenalty(
  riskLevel: AIExecutionDecisionRiskLevel,
): number {
  switch (riskLevel) {
    case "critical":
      return 1;
    case "high":
      return 0.72;
    case "medium":
      return 0.38;
    case "low":
      return 0.12;
  }
}

export function clampAIExecutionDecisionScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;

  return value;
}