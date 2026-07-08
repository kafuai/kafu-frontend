export interface BillingPolicy {
  allowTrial: boolean;
  allowDowngrade: boolean;
  allowUpgrade: boolean;
  gracePeriodDays: number;
  retryFailedPayments: boolean;
  maxRetryAttempts: number;
}

export const defaultBillingPolicy: BillingPolicy = {
  allowTrial: true,
  allowDowngrade: true,
  allowUpgrade: true,
  gracePeriodDays: 7,
  retryFailedPayments: true,
  maxRetryAttempts: 3,
};

export const canRetryPayment = (
  policy: BillingPolicy,
  attempts: number
): boolean => policy.retryFailedPayments && attempts < policy.maxRetryAttempts;
