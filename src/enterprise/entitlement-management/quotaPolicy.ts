import { UsageQuota, isQuotaExceeded } from "./usageQuota";

export interface QuotaPolicy {
  id: string;
  quotaKey: string;
  hardLimit: boolean;
}

export function evaluateQuotaPolicy(
  policy: QuotaPolicy,
  quota: UsageQuota,
): boolean {
  if (!policy.hardLimit) {
    return true;
  }

  return !isQuotaExceeded(quota);
}