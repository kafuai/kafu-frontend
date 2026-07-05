export type OperationalGovernanceStatus =
  | "draft"
  | "active"
  | "under_review"
  | "retired";

export type OperationalGovernanceScope =
  | "team"
  | "department"
  | "business_unit"
  | "enterprise";

export interface OperationalGovernanceRule {
  readonly id: string;
  readonly name: string;
  readonly scope: OperationalGovernanceScope;
  readonly status: OperationalGovernanceStatus;
  readonly owner: string;
  readonly effectiveFrom: string;
  readonly reviewBy: string;
}

export function isOperationalGovernanceRuleActive(
  rule: OperationalGovernanceRule,
): boolean {
  return rule.status === "active";
}

export function requiresOperationalGovernanceReview(
  rule: OperationalGovernanceRule,
  currentDate: string,
): boolean {
  return rule.status === "under_review" || rule.reviewBy <= currentDate;
}