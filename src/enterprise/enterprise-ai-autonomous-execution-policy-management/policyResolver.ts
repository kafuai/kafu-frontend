import { EnterpriseExecutionPolicy } from "./policyTypes";
import { EnterpriseExecutionPolicyDecision } from "./policyDecision";
import { createEnterpriseExecutionPolicyDecision } from "./policyDecision";
import { EnterpriseExecutionPolicyEvaluationContext } from "./policyEvaluationContext";
import { evaluateEnterpriseExecutionPolicy } from "./policyConditionEvaluator";

export function resolveEnterpriseExecutionPolicies(
  policies: EnterpriseExecutionPolicy[],
  context: EnterpriseExecutionPolicyEvaluationContext
): EnterpriseExecutionPolicyDecision {
  const matched = policies.filter(policy =>
    evaluateEnterpriseExecutionPolicy(policy, context)
  );

  return createEnterpriseExecutionPolicyDecision(matched);
}