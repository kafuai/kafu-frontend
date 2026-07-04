import { GovernanceDecisionStatus } from "./governanceTypes";

export type GovernanceMetrics = {
  totalEvaluations: number;
  approved: number;
  rejected: number;
  requiresReview: number;
};

export function createEmptyGovernanceMetrics(): GovernanceMetrics {
  return {
    totalEvaluations: 0,
    approved: 0,
    rejected: 0,
    requiresReview: 0,
  };
}

export function recordGovernanceDecision(
  metrics: GovernanceMetrics,
  status: GovernanceDecisionStatus,
): GovernanceMetrics {
  metrics.totalEvaluations++;

  switch (status) {
    case "approved":
      metrics.approved++;
      break;

    case "rejected":
      metrics.rejected++;
      break;

    case "requires_review":
      metrics.requiresReview++;
      break;
  }

  return metrics;
}