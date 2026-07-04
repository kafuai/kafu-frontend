import { AIAutonomousIntelligenceInsight } from "./aiAutonomousIntelligenceInsight";

export interface AIAutonomousIntelligenceDecisionAssessment {
  approved: boolean;
  requiresExecutiveReview: boolean;
  confidenceScore: number;
  reason: string;
}

export function assessAIAutonomousIntelligenceDecision(
  insight: AIAutonomousIntelligenceInsight,
): AIAutonomousIntelligenceDecisionAssessment {
  const confidenceMap = {
    low: 25,
    medium: 50,
    high: 80,
    "very-high": 95,
  } as const;

  const confidenceScore = confidenceMap[insight.confidence];

  const requiresExecutiveReview =
    insight.priority === "urgent" ||
    insight.recommendations.some((r) => r.requiresApproval);

  return {
    approved:
      confidenceScore >= 80 &&
      !requiresExecutiveReview,
    requiresExecutiveReview,
    confidenceScore,
    reason: requiresExecutiveReview
      ? "Executive approval required."
      : "Decision can continue autonomously.",
  };
}