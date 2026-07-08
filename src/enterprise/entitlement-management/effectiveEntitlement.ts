import { EntitlementRecord } from "./entitlement";

export interface EffectiveEntitlement {
  tenantId: string;
  workspaceId?: string;
  userId?: string;
  entitlements: EntitlementRecord[];
  calculatedAt: Date;
}

export function calculateEffectiveEntitlements(
  tenantId: string,
  entitlements: EntitlementRecord[],
): EffectiveEntitlement {
  return {
    tenantId,
    entitlements: entitlements.filter(
      (entitlement) =>
        entitlement.tenantId === tenantId && entitlement.status === "active",
    ),
    calculatedAt: new Date(),
  };
}