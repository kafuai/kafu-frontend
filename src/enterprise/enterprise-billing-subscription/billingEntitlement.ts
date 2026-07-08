import { BillingEntitlement } from "./billingSubscriptionTypes";

export function createBillingEntitlement(
  entitlement: BillingEntitlement,
): BillingEntitlement {
  return {
    ...entitlement,
    featureKey: entitlement.featureKey.trim(),
  };
}

export function isBillingFeatureEnabled(
  entitlements: BillingEntitlement[],
  featureKey: string,
): boolean {
  return entitlements.some(
    (entitlement) =>
      entitlement.featureKey === featureKey && entitlement.enabled,
  );
}

export function getBillingFeatureLimit(
  entitlements: BillingEntitlement[],
  featureKey: string,
): number | "unlimited" | undefined {
  return entitlements.find(
    (entitlement) => entitlement.featureKey === featureKey,
  )?.limit;
}