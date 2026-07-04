import { EnterpriseExecutionPolicy } from "./policyTypes";

export interface EnterpriseExecutionPolicySnapshot {
  id: string;
  policyId: string;
  version: number;
  capturedAt: string;
  policy: EnterpriseExecutionPolicy;
}

export function createEnterpriseExecutionPolicySnapshot(
  id: string,
  policy: EnterpriseExecutionPolicy
): EnterpriseExecutionPolicySnapshot {
  return {
    id,
    policyId: policy.id,
    version: policy.version,
    capturedAt: new Date().toISOString(),
    policy
  };
}