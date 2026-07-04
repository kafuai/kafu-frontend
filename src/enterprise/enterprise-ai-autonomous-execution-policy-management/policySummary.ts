import { EnterpriseExecutionPolicy } from "./policyTypes";

export interface EnterpriseExecutionPolicySummary {
  total: number;
  active: number;
  draft: number;
  deprecated: number;
  retired: number;
}

export function summarizeEnterpriseExecutionPolicies(
  policies: EnterpriseExecutionPolicy[]
): EnterpriseExecutionPolicySummary {
  return {
    total: policies.length,
    active: policies.filter(policy => policy.status === "active").length,
    draft: policies.filter(policy => policy.status === "draft").length,
    deprecated: policies.filter(policy => policy.status === "deprecated").length,
    retired: policies.filter(policy => policy.status === "retired").length
  };
}