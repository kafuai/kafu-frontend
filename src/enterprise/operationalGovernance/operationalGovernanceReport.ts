import type { OperationalGovernanceRule } from "./operationalGovernance";
import {
  calculateOperationalGovernanceMetrics,
  type OperationalGovernanceMetrics,
} from "./operationalGovernanceMetrics";

export interface OperationalGovernanceReport {
  readonly id: string;
  readonly generatedAt: string;
  readonly metrics: OperationalGovernanceMetrics;
  readonly activeRuleIds: readonly string[];
  readonly reviewRuleIds: readonly string[];
}

export function createOperationalGovernanceReport(
  id: string,
  generatedAt: string,
  rules: readonly OperationalGovernanceRule[],
): OperationalGovernanceReport {
  return {
    id,
    generatedAt,
    metrics: calculateOperationalGovernanceMetrics(rules),
    activeRuleIds: rules
      .filter((rule) => rule.status === "active")
      .map((rule) => rule.id),
    reviewRuleIds: rules
      .filter((rule) => rule.status === "under_review")
      .map((rule) => rule.id),
  };
}