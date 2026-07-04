import { EnterpriseExecutionPolicy } from "./policyTypes";

export function createNextEnterpriseExecutionPolicyVersion(
  policy: EnterpriseExecutionPolicy
): EnterpriseExecutionPolicy {
  return {
    ...policy,
    version: policy.version + 1,
    updatedAt: new Date().toISOString()
  };
}

export function isEnterpriseExecutionPolicyNewer(
  current: EnterpriseExecutionPolicy,
  incoming: EnterpriseExecutionPolicy
): boolean {
  return incoming.version > current.version;
}