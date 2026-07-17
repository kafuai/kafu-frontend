import { RankedStrategicDecision } from "./strategicDecisionRankingEngine";
import { StrategicDecisionRecommendation } from "./strategicDecisionResult";

export interface StrategicDecisionNarrative {
  executiveSummary: string;
  strategicRationale: string;
  riskNarrative: string;
  executionNarrative: string;
  recommendationNarrative: string;
}

export function buildStrategicDecisionNarrative(
  rankedDecision: RankedStrategicDecision,
  recommendation: StrategicDecisionRecommendation,
): StrategicDecisionNarrative {
  const { decision, score, riskAssessment, rank } = rankedDecision;

  const executiveSummary =
    `${decision.title} is ranked #${rank} with an executive priority score of ` +
    `${rankedDecision.executivePriorityScore}/100. The decision is classified as ` +
    `${decision.priority} priority with ${decision.confidence} confidence.`;

  const strategicRationale =
    `The decision supports the strategic objective "${decision.strategicObjective}" ` +
    `and achieved a strategic alignment score of ${score.strategicAlignmentScore}/100. ` +
    `Its expected outcome is: ${decision.expectedOutcome}`;

  const riskNarrative =
    `The overall risk level is ${riskAssessment.riskLevel}, with an aggregate risk ` +
    `score of ${riskAssessment.aggregateRiskScore}/100 and an execution pressure ` +
    `score of ${riskAssessment.executionPressureScore}/100.`;

  const executionNarrative =
    `Execution feasibility is scored at ${score.executionFeasibilityScore}/100, ` +
    `while urgency is scored at ${score.urgencyScore}/100. ` +
    `${decision.dependencies.length} dependencies and ` +
    `${decision.constraints.length} constraints require active management.`;

  const recommendationNarrative =
    `${recommendation.summary} Recommended next action: ` +
    `${recommendation.recommendedActions[0]}`;

  return {
    executiveSummary,
    strategicRationale,
    riskNarrative,
    executionNarrative,
    recommendationNarrative,
  };
}
