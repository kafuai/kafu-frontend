import { EntitlementRecord } from "./entitlement";

export interface FeatureEntitlement extends EntitlementRecord {
  featureKey: string;
}

export function hasFeatureAccess(
  entitlement: FeatureEntitlement,
): boolean {
  return entitlement.status === "active";
}