import { EntitlementRecord } from "./entitlement";

export interface EntitlementValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateEntitlement(
  entitlement: EntitlementRecord,
): EntitlementValidationResult {
  const errors: string[] = [];

  if (!entitlement.id) errors.push("Entitlement id is required");
  if (!entitlement.tenantId) errors.push("Tenant id is required");
  if (!entitlement.code) errors.push("Entitlement code is required");
  if (!entitlement.name) errors.push("Entitlement name is required");

  return {
    valid: errors.length === 0,
    errors,
  };
}