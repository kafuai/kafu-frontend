import type {
  RevenueOwner,
  RevenueTimeframe,
} from "./revenueOperationsTypes";

export interface RevenueQuota {
  id: string;
  owner: RevenueOwner;
  targetAmount: number;
  achievedAmount: number;
  currency: string;
  timeframe: RevenueTimeframe;
}

export function calculateQuotaAttainment(quota: RevenueQuota): number {
  if (quota.targetAmount <= 0) {
    return 0;
  }

  return quota.achievedAmount / quota.targetAmount;
}

export function isQuotaAtRisk(quota: RevenueQuota, threshold = 0.75): boolean {
  return calculateQuotaAttainment(quota) < threshold;
}
