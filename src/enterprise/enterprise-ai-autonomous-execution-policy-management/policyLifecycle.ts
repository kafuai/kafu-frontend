import {
  EnterpriseExecutionPolicy,
  EnterpriseExecutionPolicyStatus
} from "./policyTypes";

export function transitionEnterpriseExecutionPolicyStatus(
  policy: EnterpriseExecutionPolicy,
  status: EnterpriseExecutionPolicyStatus
): EnterpriseExecutionPolicy {
  return {
    ...policy,
    status,
    updatedAt: new Date().toISOString()
  };
}

export function retireEnterpriseExecutionPolicy(
  policy: EnterpriseExecutionPolicy
): EnterpriseExecutionPolicy {
  return transitionEnterpriseExecutionPolicyStatus(policy, "retired");
}

export function activateEnterpriseExecutionPolicy(
  policy: EnterpriseExecutionPolicy
): EnterpriseExecutionPolicy {
  return transitionEnterpriseExecutionPolicyStatus(policy, "active");
}

export function deprecateEnterpriseExecutionPolicy(
  policy: EnterpriseExecutionPolicy
): EnterpriseExecutionPolicy {
  return transitionEnterpriseExecutionPolicyStatus(policy, "deprecated");
}