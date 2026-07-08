import { EntitlementRecord } from "./entitlement";

export interface EntitlementProvisioningResult {
  provisioned: boolean;
  entitlementId: string;
  reason: string;
}

export function provisionEntitlement(
  entitlement: EntitlementRecord,
): EntitlementProvisioningResult {
  return {
    provisioned: entitlement.status === "active",
    entitlementId: entitlement.id,
    reason:
      entitlement.status === "active"
        ? "entitlement_provisioned"
        : "entitlement_not_active",
  };
}