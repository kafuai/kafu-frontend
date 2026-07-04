import { EnterpriseExecutionPolicy } from "./policyTypes";

export interface EnterpriseExecutionPolicyChangeSet {
  policyId: string;
  fromVersion: number;
  toVersion: number;
  changedFields: string[];
  changedAt: string;
}

export function createEnterpriseExecutionPolicyChangeSet(
  previous: EnterpriseExecutionPolicy,
  next: EnterpriseExecutionPolicy
): EnterpriseExecutionPolicyChangeSet {
  const changedFields = Object.keys(next).filter(
    key =>
      JSON.stringify(previous[key as keyof EnterpriseExecutionPolicy]) !==
      JSON.stringify(next[key as keyof EnterpriseExecutionPolicy])
  );

  return {
    policyId: next.id,
    fromVersion: previous.version,
    toVersion: next.version,
    changedFields,
    changedAt: new Date().toISOString()
  };
}