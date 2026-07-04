import { EnterpriseExecutionPolicy } from "./policyTypes";

export interface EnterpriseExecutionPolicyConflict {
  policyAId: string;
  policyBId: string;
  reason: string;
}

export function detectEnterpriseExecutionPolicyConflicts(
  policies: EnterpriseExecutionPolicy[]
): EnterpriseExecutionPolicyConflict[] {
  const conflicts: EnterpriseExecutionPolicyConflict[] = [];

  for (let i = 0; i < policies.length; i++) {
    for (let j = i + 1; j < policies.length; j++) {
      const a = policies[i];
      const b = policies[j];

      if (
        a.scope.tenantId === b.scope.tenantId &&
        a.scope.environment === b.scope.environment &&
        a.priority === b.priority &&
        a.effect.allowExecution !== b.effect.allowExecution
      ) {
        conflicts.push({
          policyAId: a.id,
          policyBId: b.id,
          reason: "Policies share tenant, environment, and priority but produce opposite execution effects."
        });
      }
    }
  }

  return conflicts;
}