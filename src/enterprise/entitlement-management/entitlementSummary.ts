import { EntitlementRecord } from "./entitlement";

export interface EntitlementSummary {
  tenantId: string;
  totalEntitlements: number;
  activeEntitlements: number;
  suspendedEntitlements: number;
  expiredEntitlements: number;
}

export function summarizeEntitlements(
  tenantId: string,
  entitlements: EntitlementRecord[],
): EntitlementSummary {
  const scoped = entitlements.filter((item) => item.tenantId === tenantId);

  return {
    tenantId,
    totalEntitlements: scoped.length,
    activeEntitlements: scoped.filter((item) => item.status === "active").length,
    suspendedEntitlements: scoped.filter((item) => item.status === "suspended")
      .length,
    expiredEntitlements: scoped.filter((item) => item.status === "expired").length,
  };
}