import {
  AIOptimizationImpactLevel,
  AIOptimizationPriority,
  AIOptimizationRiskLevel,
} from "../aiOptimizationTypes";
import { OptimizationOpportunity } from "./optimizationOpportunity";
import { OptimizationImpactAssessment } from "./optimizationImpactAssessment";

export interface OptimizationPolicy {
  id: string;
  organizationId: string;
  name: string;
  minimumConfidence: number;
  allowedRiskLevels: AIOptimizationRiskLevel[];
  minimumImpactLevel: AIOptimizationImpactLevel;
  autoApprovePriorities: AIOptimizationPriority[];
  requiresHumanApproval: boolean;
  active: boolean;
}

export interface OptimizationPolicyDecision {
  opportunityId: string;
  policyId: string;
  approved: boolean;
  requiresHumanApproval: boolean;
  reasons: string[];
  decidedAt: Date;
}

export function evaluateOptimizationPolicy(
  opportunity: OptimizationOpportunity,
  assessment: OptimizationImpactAssessment,
  policy: OptimizationPolicy,
): OptimizationPolicyDecision {
  const reasons: string[] = [];

  if (!policy.active) {
    reasons.push("Policy is inactive.");
  }

  if (opportunity.confidence < policy.minimumConfidence) {
    reasons.push("Opportunity confidence is below policy threshold.");
  }

  if (!policy.allowedRiskLevels.includes(opportunity.riskLevel)) {
    reasons.push("Opportunity risk level is not allowed by policy.");
  }

  if (
    getImpactRank(assessment.impactLevel) <
    getImpactRank(policy.minimumImpactLevel)
  ) {
    reasons.push("Opportunity impact level is below policy threshold.");
  }

  const approved = reasons.length === 0;

  return {
    opportunityId: opportunity.id,
    policyId: policy.id,
    approved,
    requiresHumanApproval:
      approved &&
      (policy.requiresHumanApproval ||
        !policy.autoApprovePriorities.includes(opportunity.priority)),
    reasons,
    decidedAt: new Date(),
  };
}

function getImpactRank(level: AIOptimizationImpactLevel): number {
  switch (level) {
    case "transformational":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
  }
}