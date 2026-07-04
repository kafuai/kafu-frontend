import { GovernanceEvaluationResult } from "./governanceEvaluation";
import { GovernancePolicy } from "./governancePolicy";
import {
  GovernanceDecision,
  GovernanceSubject,
} from "./governanceTypes";

export function evaluateGovernancePolicies(
  subject: GovernanceSubject,
  policies: GovernancePolicy[],
): GovernanceEvaluationResult {
  const matchedPolicies = policies.filter(
    (policy) =>
      policy.enabled &&
      policy.organizationId === subject.organizationId &&
      policy.subjectType === subject.type,
  );

  const rejectedPolicy = matchedPolicies.find(
    (policy) => policy.effect === "deny",
  );

  const reviewPolicy = matchedPolicies.find(
    (policy) => policy.effect === "review",
  );

  const decision: GovernanceDecision = {
    subject,
    status: rejectedPolicy
      ? "rejected"
      : reviewPolicy
        ? "requires_review"
        : "approved",
    severity: rejectedPolicy?.severity ?? reviewPolicy?.severity ?? "low",
    reason: rejectedPolicy
      ? rejectedPolicy.name
      : reviewPolicy
        ? reviewPolicy.name
        : "No blocking governance policy matched.",
    createdAt: new Date(),
  };

  return {
    subject,
    matchedPolicies,
    decision,
  };
}