import { EntitlementRecord } from "./entitlement";

export interface UsageQuota extends EntitlementRecord {
  quotaKey: string;
  limit: number;
  used: number;
  resetAt?: Date;
}

export function getRemainingQuota(quota: UsageQuota): number {
  return Math.max(quota.limit - quota.used, 0);
}

export function isQuotaExceeded(quota: UsageQuota): boolean {
  return quota.used >= quota.limit;
}