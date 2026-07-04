import { EnterpriseExecutionPolicy } from "./policyTypes";

export type EnterpriseExecutionPolicyDecisionStatus =
  | "allowed"
  | "denied"
  | "requires_approval"
  | "requires_escalation";

export interface EnterpriseExecutionPolicyDecision {
  status: EnterpriseExecutionPolicyDecisionStatus;
  matchedPolicies: EnterpriseExecutionPolicy[];
  reasons: string[];
  maxRetryAttempts?: number;
  timeoutMs?: number;
  resourceLimit?: number;
}

export function createEnterpriseExecutionPolicyDecision(
  matchedPolicies: EnterpriseExecutionPolicy[]
): EnterpriseExecutionPolicyDecision {
  const blockingPolicy = matchedPolicies.find(
    (policy) => !policy.effect.allowExecution
  );

  const approvalPolicy = matchedPolicies.find(
    (policy) => policy.effect.requiresApproval
  );

  const escalationPolicy = matchedPolicies.find(
    (policy) => policy.effect.requiresEscalation
  );

  const status: EnterpriseExecutionPolicyDecisionStatus = blockingPolicy
    ? "denied"
    : escalationPolicy
      ? "requires_escalation"
      : approvalPolicy
        ? "requires_approval"
        : "allowed";

  return {
    status,
    matchedPolicies,
    reasons: matchedPolicies.map((policy) => policy.effect.reason),
    maxRetryAttempts: resolveLowestDefinedNumber(
      matchedPolicies.map((policy) => policy.effect.maxRetryAttempts)
    ),
    timeoutMs: resolveLowestDefinedNumber(
      matchedPolicies.map((policy) => policy.effect.timeoutMs)
    ),
    resourceLimit: resolveLowestDefinedNumber(
      matchedPolicies.map((policy) => policy.effect.resourceLimit)
    ),
  };
}

function resolveLowestDefinedNumber(
  values: Array<number | undefined>
): number | undefined {
  const definedValues = values.filter(
    (value): value is number => typeof value === "number"
  );

  if (definedValues.length === 0) {
    return undefined;
  }

  return Math.min(...definedValues);
}