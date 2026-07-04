import {
  AIAutonomousGovernanceContext,
  AIAutonomousGovernanceRiskLevel,
} from "./aiAutonomousGovernanceTypes";

export interface AIAutonomousGovernanceRiskAssessment {
  executionId: string;
  riskLevel: AIAutonomousGovernanceRiskLevel;
  score: number;
  reasons: string[];
  assessedAt: Date;
}

export function assessAIAutonomousGovernanceRisk(
  context: AIAutonomousGovernanceContext,
): AIAutonomousGovernanceRiskAssessment {
  const reasons: string[] = [];
  let score = 0;

  if (context.environment === "production") {
    score += 35;
    reasons.push("Execution targets production environment.");
  }

  if (context.objective.toLowerCase().includes("delete")) {
    score += 30;
    reasons.push("Objective may include destructive action.");
  }

  if (context.objective.toLowerCase().includes("customer")) {
    score += 20;
    reasons.push("Objective may affect customer-facing data or workflows.");
  }

  if (context.capabilityId.toLowerCase().includes("autonomous")) {
    score += 15;
    reasons.push("Capability includes autonomous execution behavior.");
  }

  const riskLevel = resolveAIAutonomousGovernanceRiskLevel(score);

  return {
    executionId: context.executionId,
    riskLevel,
    score,
    reasons: reasons.length > 0 ? reasons : ["No elevated risk indicators detected."],
    assessedAt: new Date(),
  };
}

export function resolveAIAutonomousGovernanceRiskLevel(
  score: number,
): AIAutonomousGovernanceRiskLevel {
  if (score >= 80) {
    return "critical";
  }

  if (score >= 55) {
    return "high";
  }

  if (score >= 25) {
    return "medium";
  }

  return "low";
}