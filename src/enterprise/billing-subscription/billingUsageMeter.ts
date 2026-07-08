import type { BillingAuditMetadata } from "./billingSubscriptionTypes";

export interface BillingUsageMeter extends BillingAuditMetadata {
  id: string;
  tenantId: string;
  subscriptionId: string;
  featureKey: string;
  used: number;
  unit: string;
  measuredAt: string;
  periodStart: string;
  periodEnd: string;
}

export const createBillingUsageMeter = (
  meter: BillingUsageMeter
): BillingUsageMeter => meter;

export const getUsagePercentage = (
  meter: BillingUsageMeter,
  limit: number
): number => {
  if (limit <= 0) return 0;
  return Math.min((meter.used / limit) * 100, 100);
};

export const isUsageOverLimit = (
  meter: BillingUsageMeter,
  limit: number
): boolean => meter.used > limit;
