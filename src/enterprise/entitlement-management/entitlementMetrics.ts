import { EntitlementRecord } from "./entitlement";

export interface EntitlementMetrics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  expired: number;
}

export function calculateEntitlementMetrics(
  entitlements: EntitlementRecord[],
): EntitlementMetrics {
  return {
    total: entitlements.length,
    active: entitlements.filter((item) => item.status === "active").length,
    inactive: entitlements.filter((item) => item.status === "inactive").length,
    suspended: entitlements.filter((item) => item.status === "suspended").length,
    expired: entitlements.filter((item) => item.status === "expired").length,
  };
}