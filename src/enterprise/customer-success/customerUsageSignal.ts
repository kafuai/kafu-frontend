export interface CustomerUsageSignal {
  accountId: string;
  feature: string;
  usageCount: number;
  recordedAt: Date;
}

export function createUsageSignal(
  signal: CustomerUsageSignal,
): CustomerUsageSignal {
  return signal;
}