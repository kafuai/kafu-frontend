import type { OperationalGovernanceRule } from "./operationalGovernance";
import {
  satisfiesOperationalGovernancePolicy,
  type OperationalGovernancePolicy,
} from "./operationalGovernancePolicy";

export type OperationalGovernanceDecision =
  | "approved"
  | "rejected"
  | "requires_review";

export interface OperationalGovernanceDecisionResult {
  readonly ruleId: string;
  readonly decision: OperationalGovernanceDecision;
  readonly reasons: readonly string[];
}

export function evaluateOperationalGovernanceDecision(
  rule: OperationalGovernanceRule,
  policy: OperationalGovernancePolicy,
  currentDate: string,
): OperationalGovernanceDecisionResult {
  const reasons: string[] = [];

  if (rule.status !== "active" && policy.requireActiveRules) {
    reasons.push("Governance rule is not active.");
  }

  if (!policy.allowExpiredReviews && rule.reviewBy <= currentDate) {
    reasons.push("Governance review date has expired.");
  }

  if (
    policy.allowedScopes &&
    !policy.allowedScopes.includes(rule.scope)
  ) {
    reasons.push("Governance scope is not allowed.");
  }

  if (reasons.length === 0) {
    return {
      ruleId: rule.id,
      decision: "approved",
      reasons: [],
    };
  }

  if (satisfiesOperationalGovernancePolicy(rule, policy, currentDate)) {
    return {
      ruleId: rule.id,
      decision: "requires_review",
      reasons,
    };
  }

  return {
    ruleId: rule.id,
    decision: "rejected",
    reasons,
  };
}