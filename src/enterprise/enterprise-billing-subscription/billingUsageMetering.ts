import {
  BillingUsageRecord,
} from "./billingSubscriptionTypes";

export function recordBillingUsage(
  usage: BillingUsageRecord,
): BillingUsageRecord {
  return {
    ...usage,
    quantity: Math.max(0, usage.quantity),
  };
}

export function calculateTotalUsage(
  usageRecords: BillingUsageRecord[],
): number {
  return usageRecords.reduce(
    (total, record) => total + record.quantity,
    0,
  );
}

export function calculateUsageByMetric(
  usageRecords: BillingUsageRecord[],
  metricKey: string,
): number {
  return usageRecords
    .filter((record) => record.metricKey === metricKey)
    .reduce((total, record) => total + record.quantity, 0);
}

export function hasExceededUsageLimit(
  usedUnits: number,
  includedUnits: number,
): boolean {
  return usedUnits > includedUnits;
}