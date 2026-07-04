import { EnterpriseExecutionPolicy } from "./policyTypes";

export interface EnterpriseExecutionPolicyCatalog {
  policies: EnterpriseExecutionPolicy[];
}

export function createEnterpriseExecutionPolicyCatalog(
  policies: EnterpriseExecutionPolicy[]
): EnterpriseExecutionPolicyCatalog {
  return {
    policies: [...policies].sort((a, b) => b.priority - a.priority),
  };
}

export function findActiveEnterpriseExecutionPolicies(
  catalog: EnterpriseExecutionPolicyCatalog
): EnterpriseExecutionPolicy[] {
  return catalog.policies.filter((policy) => policy.status === "active");
}

export function findEnterpriseExecutionPolicyById(
  catalog: EnterpriseExecutionPolicyCatalog,
  policyId: string
): EnterpriseExecutionPolicy | undefined {
  return catalog.policies.find((policy) => policy.id === policyId);
}

export function findEnterpriseExecutionPoliciesByTenant(
  catalog: EnterpriseExecutionPolicyCatalog,
  tenantId: string
): EnterpriseExecutionPolicy[] {
  return catalog.policies.filter((policy) => policy.scope.tenantId === tenantId);
}