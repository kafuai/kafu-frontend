import { EntitlementRecord } from "./entitlement";

export interface EntitlementSnapshot {
  id: string;
  tenantId: string;
  entitlements: EntitlementRecord[];
  capturedAt: Date;
}

export function createEntitlementSnapshot(
  id: string,
  tenantId: string,
  entitlements: EntitlementRecord[],
): EntitlementSnapshot {
  return {
    id,
    tenantId,
    entitlements: entitlements.filter((item) => item.tenantId === tenantId),
    capturedAt: new Date(),
  };
}