import {
  AIExecutionGovernancePolicy,
  AIExecutionGovernanceRiskLevel,
} from "./aiExecutionGovernanceTypes";

export function createAIExecutionGovernancePolicy(
  policy: AIExecutionGovernancePolicy
): AIExecutionGovernancePolicy {
  return {
    ...policy,
    createdAt: policy.createdAt || new Date().toISOString(),
  };
}

export function filterGovernancePoliciesByRisk(
  policies: AIExecutionGovernancePolicy[],
  riskLevel: AIExecutionGovernanceRiskLevel
): AIExecutionGovernancePolicy[] {
  return policies.filter(
    (policy) => policy.riskLevel === riskLevel || policy.mandatory
  );
}

export function getMandatoryGovernancePolicies(
  policies: AIExecutionGovernancePolicy[]
): AIExecutionGovernancePolicy[] {
  return policies.filter((policy) => policy.mandatory);
}