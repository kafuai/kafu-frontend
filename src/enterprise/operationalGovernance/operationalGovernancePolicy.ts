import type { OperationalGovernanceRule } from "./operationalGovernance";

export interface OperationalGovernancePolicy {
  readonly requireActiveRules: boolean;
  readonly allowExpiredReviews: boolean;
  readonly allowedScopes?: readonly string[];
}

export function satisfiesOperationalGovernancePolicy(
  rule: OperationalGovernanceRule,
  policy: OperationalGovernancePolicy,
  currentDate: string,
): boolean {
  if (policy.requireActiveRules && rule.status !== "active") {
    return false;
  }

  if (!policy.allowExpiredReviews && rule.reviewBy <= currentDate) {
    return false;
  }

  if (
    policy.allowedScopes &&
    !policy.allowedScopes.includes(rule.scope)
  ) {
    return false;
  }

  return true;
}