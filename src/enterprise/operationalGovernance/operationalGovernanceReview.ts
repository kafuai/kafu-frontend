import type { OperationalGovernanceRule } from "./operationalGovernance";

export interface OperationalGovernanceReviewFinding {
  readonly id: string;
  readonly ruleId: string;
  readonly severity: "low" | "medium" | "high";
  readonly description: string;
  readonly recommendation: string;
}

export function createOperationalGovernanceReviewFindings(
  rules: readonly OperationalGovernanceRule[],
): readonly OperationalGovernanceReviewFinding[] {
  return rules
    .filter(
      (rule) =>
        rule.status === "under_review" ||
        rule.status === "retired",
    )
    .map((rule) => ({
      id: `${rule.id}:review`,
      ruleId: rule.id,
      severity:
        rule.status === "retired" ? "high" : "medium",
      description: `Governance rule "${rule.name}" requires attention.`,
      recommendation:
        rule.status === "retired"
          ? "Replace or retire dependent operational processes."
          : "Complete governance review before continuing execution.",
    }));
}