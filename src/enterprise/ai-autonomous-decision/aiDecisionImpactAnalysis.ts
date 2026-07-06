import { AIDecisionOption } from "./aiDecisionOption";
import { AIDecisionRiskAssessment } from "./aiDecisionRiskAssessment";
import { AIDecisionScorecard } from "./aiDecisionScorecard";

export type AIDecisionImpactLevel = "low" | "medium" | "high" | "critical";

export interface AIDecisionImpactAnalysis {
  optionId: string;
  operationalImpact: AIDecisionImpactLevel;
  financialImpact: AIDecisionImpactLevel;
  complianceImpact: AIDecisionImpactLevel;
  strategicImpact: AIDecisionImpactLevel;
  overallImpact: AIDecisionImpactLevel;
  rationale: string;
}

function impactToWeight(level: AIDecisionImpactLevel): number {
  const weights: Record<AIDecisionImpactLevel, number> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

  return weights[level];
}

function weightToImpact(weight: number): AIDecisionImpactLevel {
  if (weight >= 3.5) return "critical";
  if (weight >= 2.5) return "high";
  if (weight >= 1.5) return "medium";
  return "low";
}

export function analyzeAIDecisionImpact(
  option: AIDecisionOption,
  scorecard: AIDecisionScorecard,
  risk: AIDecisionRiskAssessment,
): AIDecisionImpactAnalysis {
  const operationalImpact: AIDecisionImpactLevel =
    scorecard.totalScore >= 80 ? "high" : scorecard.totalScore >= 60 ? "medium" : "low";

  const financialImpact: AIDecisionImpactLevel =
    option.estimatedCost >= 100000 ? "critical" : option.estimatedCost >= 50000 ? "high" : "medium";

  const complianceImpact: AIDecisionImpactLevel =
    risk.riskLevel === "high" ? "high" : risk.riskLevel === "medium" ? "medium" : "low";

  const strategicImpact: AIDecisionImpactLevel =
    scorecard.totalScore >= 85 ? "high" : scorecard.totalScore >= 65 ? "medium" : "low";

  const averageWeight =
    (impactToWeight(operationalImpact) +
      impactToWeight(financialImpact) +
      impactToWeight(complianceImpact) +
      impactToWeight(strategicImpact)) /
    4;

  return {
    optionId: option.id,
    operationalImpact,
    financialImpact,
    complianceImpact,
    strategicImpact,
    overallImpact: weightToImpact(averageWeight),
    rationale:
      "Impact analysis derived from decision score, estimated cost, and risk level.",
  };
}