import type { EnterpriseMemoryRecord } from "./memoryTypes";

export interface EnterpriseMemorySnapshot {
  readonly createdAt: string;
  readonly totalRecords: number;
  readonly records: readonly EnterpriseMemoryRecord[];
}

export function createEnterpriseMemorySnapshot(
  records: readonly EnterpriseMemoryRecord[],
): EnterpriseMemorySnapshot {
  return {
    createdAt: new Date().toISOString(),
    totalRecords: records.length,
    records,
  };
}