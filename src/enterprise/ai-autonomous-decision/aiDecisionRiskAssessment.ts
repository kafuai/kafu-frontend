import { AIDecisionRiskLevel } from "./aiAutonomousDecisionTypes";
import { AIDecisionOption } from "./aiDecisionOption";
import { AIDecisionScorecard } from "./aiDecisionScorecard";

export interface AIDecisionRiskAssessment {
  optionId: string;
  riskLevel: AIDecisionRiskLevel;
  riskScore: number;
  blockers: string[];
  warnings: string[];
  assessedAt: Date;
}

function baseRiskScore(riskLevel: AIDecisionRiskLevel): number {
  switch (riskLevel) {
    case "low":
      return 0.2;
    case "medium":
      return 0.45;
    case "high":
      return 0.75;
    case "critical":
    case "severe":
      return 0.95;
  }
}

export function assessAIDecisionRisk(
  option: AIDecisionOption,
  scorecard: AIDecisionScorecard,
): AIDecisionRiskAssessment {
  const blockers: string[] = [];
  const warnings: string[] = [];

  if (option.riskLevel === "critical" || option.riskLevel === "severe") {
    blockers.push("Decision option has critical or severe risk and requires escalation.");
  }

  if ((option.feasibility ?? 1) < 0.4) {
    blockers.push("Decision option feasibility is below enterprise threshold.");
  }

  if (option.estimatedCost > 0.8) {
    warnings.push("Decision option has high estimated cost.");
  }

  if (scorecard.totalScore < 0.5) {
    warnings.push("Decision option score is below recommended threshold.");
  }

  return {
    optionId: option.id,
    riskLevel: option.riskLevel,
    riskScore: Math.max(
      0,
      Math.min(1, baseRiskScore(option.riskLevel) + warnings.length * 0.05),
    ),
    blockers,
    warnings,
    assessedAt: new Date(),
  };
}