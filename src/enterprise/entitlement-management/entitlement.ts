import { EnterpriseEntitlement } from "./entitlementTypes";

export interface EntitlementRecord extends EnterpriseEntitlement {
  description?: string;
  metadata?: Record<string, unknown>;
}

export function createEntitlement(
  entitlement: EntitlementRecord,
): EntitlementRecord {
  return entitlement;
}