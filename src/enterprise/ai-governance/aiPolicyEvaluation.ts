import {
  AIGovernancePolicy,
  AIUseCaseProfile,
} from "./aiGovernanceTypes";

export type AIPolicyEvaluationOutcome =
  | "compliant"
  | "non_compliant"
  | "requires_review";

export interface AIPolicyEvaluationResult {
  useCaseId: string;
  policyId: string;
  outcome: AIPolicyEvaluationOutcome;
  violations: string[];
  recommendations: string[];
}

export function evaluateAIPolicyCompliance(
  policy: AIGovernancePolicy,
  useCase: AIUseCaseProfile,
): AIPolicyEvaluationResult {
  const violations: string[] = [];
  const recommendations: string[] = [];

  if (policy.status !== "active") {
    violations.push("Policy is not active.");
    recommendations.push("Activate the policy before applying it.");
  }

  if (
    policy.allowedUseCases.length > 0 &&
    !policy.allowedUseCases.includes(useCase.category)
  ) {
    violations.push("Use case category is not explicitly allowed.");
    recommendations.push("Review allowed AI use case categories.");
  }

  if (policy.restrictedUseCases.includes(useCase.category)) {
    violations.push("Use case category is restricted by policy.");
    recommendations.push("Escalate this use case for governance approval.");
  }

  if (policy.requiresExplainability && useCase.automatedDecisionImpact) {
    recommendations.push("Attach explainability artifacts for this use case.");
  }

  if (policy.requiresAuditTrail) {
    recommendations.push("Ensure all AI decisions are audit logged.");
  }

  return {
    useCaseId: useCase.id,
    policyId: policy.id,
    outcome:
      violations.length > 0
        ? "non_compliant"
        : useCase.automatedDecisionImpact
          ? "requires_review"
          : "compliant",
    violations,
    recommendations,
  };
}