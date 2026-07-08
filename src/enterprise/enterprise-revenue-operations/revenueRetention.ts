export interface RevenueRetentionRecord {
  id: string;
  accountId: string;
  renewalValue: number;
  churnRisk: number;
}

export function retentionHealth(
  record: RevenueRetentionRecord,
): number {
  return 1 - record.churnRisk;
}
