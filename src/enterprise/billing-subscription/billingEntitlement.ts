import type { BillingAuditMetadata } from "./billingSubscriptionTypes";

export interface BillingEntitlement extends BillingAuditMetadata {
  id: string;
  tenantId: string;
  subscriptionId: string;
  featureKey: string;
  enabled: boolean;
  limit?: number;
  unit?: string;
  expiresAt?: string;
}

export const createBillingEntitlement = (
  entitlement: BillingEntitlement
): BillingEntitlement => entitlement;

export const isEntitlementEnabled = (
  entitlement: BillingEntitlement
): boolean => entitlement.enabled;

export const hasEntitlementLimit = (
  entitlement: BillingEntitlement
): boolean => typeof entitlement.limit === "number";
