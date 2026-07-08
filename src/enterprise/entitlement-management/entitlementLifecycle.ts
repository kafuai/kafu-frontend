import { EntitlementRecord } from "./entitlement";

export function expireEntitlement(
  entitlement: EntitlementRecord,
): EntitlementRecord {
  return {
    ...entitlement,
    status: "expired",
    validUntil: entitlement.validUntil ?? new Date(),
  };
}

export function deactivateEntitlement(
  entitlement: EntitlementRecord,
): EntitlementRecord {
  return {
    ...entitlement,
    status: "inactive",
  };
}