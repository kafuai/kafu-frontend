import { EnterpriseExecutionPolicy } from "./policyTypes";
import { EnterpriseExecutionPolicyEvaluationContext } from "./policyEvaluationContext";
import { EnterpriseExecutionPolicyDecision } from "./policyDecision";
import { resolveEnterpriseExecutionPolicies } from "./policyResolver";

export interface EnterpriseExecutionPolicySimulationResult {
  simulatedAt: string;
  decision: EnterpriseExecutionPolicyDecision;
  policyIds: string[];
}

export function simulateEnterpriseExecutionPolicies(
  policies: EnterpriseExecutionPolicy[],
  context: EnterpriseExecutionPolicyEvaluationContext
): EnterpriseExecutionPolicySimulationResult {
  const decision = resolveEnterpriseExecutionPolicies(policies, context);

  return {
    simulatedAt: new Date().toISOString(),
    decision,
    policyIds: policies.map(policy => policy.id)
  };
}