import type { BillingAuditMetadata } from "./billingSubscriptionTypes";

export interface BillingQuota extends BillingAuditMetadata {
  id: string;
  tenantId: string;
  subscriptionId: string;
  featureKey: string;
  limit: number;
  used: number;
  unit: string;
  resetAt: string;
}

export const createBillingQuota = (quota: BillingQuota): BillingQuota => quota;

export const getRemainingQuota = (quota: BillingQuota): number =>
  Math.max(quota.limit - quota.used, 0);

export const isQuotaExceeded = (quota: BillingQuota): boolean =>
  quota.used >= quota.limit;
