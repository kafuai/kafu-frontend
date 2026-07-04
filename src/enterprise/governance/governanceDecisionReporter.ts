import { GovernanceDecision } from "./governanceTypes";

export type GovernanceDecisionReport = {
  total: number;
  approved: number;
  rejected: number;
  requiresReview: number;
};

export function createGovernanceDecisionReport(
  decisions: GovernanceDecision[],
): GovernanceDecisionReport {
  return {
    total: decisions.length,
    approved: decisions.filter(d => d.status === "approved").length,
    rejected: decisions.filter(d => d.status === "rejected").length,
    requiresReview: decisions.filter(
      d => d.status === "requires_review",
    ).length,
  };
}