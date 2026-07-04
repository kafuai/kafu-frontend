import { AIInnovationRiskLevel } from "./aiAutonomousInnovationTypes";
import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { scoreAIInnovationOpportunity } from "./aiInnovationScoring";

export type AIInnovationGovernanceDecisionStatus =
  | "approved"
  | "requires-review"
  | "blocked";

export interface AIInnovationGovernancePolicy {
  id: string;
  organizationId: string;
  maxAllowedRiskLevel: AIInnovationRiskLevel;
  minimumScoreForApproval: number;
  requiresHumanReviewForHighRisk: boolean;
  blockedOpportunityTypes?: string[];
}

export interface AIInnovationGovernanceDecision {
  opportunityId: string;
  decision: AIInnovationGovernanceDecisionStatus;
  reason: string;
  evaluatedAt: Date;
}

const riskWeight: Record<AIInnovationRiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function evaluateAIInnovationGovernance(
  opportunity: AIInnovationOpportunity,
  policy: AIInnovationGovernancePolicy,
): AIInnovationGovernanceDecision {
  if (opportunity.organizationId !== policy.organizationId) {
    return {
      opportunityId: opportunity.id,
      decision: "blocked",
      reason: "Opportunity organization does not match governance policy organization.",
      evaluatedAt: new Date(),
    };
  }

  if (policy.blockedOpportunityTypes?.includes(opportunity.type)) {
    return {
      opportunityId: opportunity.id,
      decision: "blocked",
      reason: `Opportunity type ${opportunity.type} is blocked by governance policy.`,
      evaluatedAt: new Date(),
    };
  }

  if (riskWeight[opportunity.riskLevel] > riskWeight[policy.maxAllowedRiskLevel]) {
    return {
      opportunityId: opportunity.id,
      decision: "blocked",
      reason: `Opportunity risk level ${opportunity.riskLevel} exceeds allowed risk ${policy.maxAllowedRiskLevel}.`,
      evaluatedAt: new Date(),
    };
  }

  if (policy.requiresHumanReviewForHighRisk && opportunity.riskLevel === "high") {
    return {
      opportunityId: opportunity.id,
      decision: "requires-review",
      reason: "High-risk innovation requires human governance review.",
      evaluatedAt: new Date(),
    };
  }

  const score = scoreAIInnovationOpportunity(opportunity).totalScore;

  if (score < policy.minimumScoreForApproval) {
    return {
      opportunityId: opportunity.id,
      decision: "requires-review",
      reason: `Innovation score ${score.toFixed(2)} is below policy approval threshold.`,
      evaluatedAt: new Date(),
    };
  }

  return {
    opportunityId: opportunity.id,
    decision: "approved",
    reason: "Innovation opportunity satisfies governance policy.",
    evaluatedAt: new Date(),
  };
}

export function filterApprovedAIInnovationOpportunities(
  opportunities: AIInnovationOpportunity[],
  policy: AIInnovationGovernancePolicy,
): AIInnovationOpportunity[] {
  return opportunities.filter(
    (opportunity) => evaluateAIInnovationGovernance(opportunity, policy).decision === "approved",
  );
}