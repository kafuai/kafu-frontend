import {
  AIExecutionGovernanceContext,
  AIExecutionGovernanceDecision,
  AIExecutionGovernancePolicy,
  AIExecutionGovernanceResult,
} from "./aiExecutionGovernanceTypes";
import { filterGovernancePoliciesByRisk } from "./aiExecutionGovernancePolicyRegistry";

function resolveGovernanceDecision(
  context: AIExecutionGovernanceContext,
  policies: AIExecutionGovernancePolicy[]
): AIExecutionGovernanceDecision {
  if (!context.compliancePassed) {
    return "rejected";
  }

  if (context.riskLevel === "critical") {
    return "requires_review";
  }

  if (policies.some((policy) => policy.requiredDecision === "requires_review")) {
    return "requires_review";
  }

  if (
    policies.some((policy) => policy.requiredDecision === "conditionally_approved")
  ) {
    return "conditionally_approved";
  }

  return "approved";
}

export function evaluateAIExecutionGovernance(
  context: AIExecutionGovernanceContext,
  policies: AIExecutionGovernancePolicy[]
): AIExecutionGovernanceResult {
  const applicablePolicies = filterGovernancePoliciesByRisk(
    policies,
    context.riskLevel
  );

  const decision = resolveGovernanceDecision(context, applicablePolicies);

  const reasons: string[] = [];

  if (!context.compliancePassed) {
    reasons.push("Execution failed compliance and cannot be governed as approved.");
  }

  if (context.riskLevel === "critical") {
    reasons.push("Critical execution risk requires governance review.");
  }

  if (applicablePolicies.length === 0) {
    reasons.push("No explicit governance policy matched; default governance applied.");
  }

  return {
    executionId: context.executionId,
    decision,
    authority:
      applicablePolicies[0]?.authority ??
      (context.riskLevel === "critical" ? "human_reviewer" : "system"),
    policyIds: applicablePolicies.map((policy) => policy.id),
    reasons,
    governedAt: new Date().toISOString(),
  };
}