import type { OperationalGovernanceRule } from "./operationalGovernance";

export interface OperationalGovernanceMetrics {
  readonly totalRules: number;
  readonly activeRules: number;
  readonly reviewRules: number;
  readonly retiredRules: number;
}

export function calculateOperationalGovernanceMetrics(
  rules: readonly OperationalGovernanceRule[],
): OperationalGovernanceMetrics {
  return {
    totalRules: rules.length,
    activeRules: rules.filter((rule) => rule.status === "active").length,
    reviewRules: rules.filter((rule) => rule.status === "under_review").length,
    retiredRules: rules.filter((rule) => rule.status === "retired").length,
  };
}