import type { OperationalAssuranceRecord } from "./operationalAssurance";

export interface OperationalAssuranceMetrics {
  readonly total: number;
  readonly verified: number;
  readonly pending: number;
  readonly failed: number;
}

export function calculateOperationalAssuranceMetrics(
  records: readonly OperationalAssuranceRecord[],
): OperationalAssuranceMetrics {
  return {
    total: records.length,
    verified: records.filter((r) => r.status === "verified").length,
    pending: records.filter((r) => r.status === "pending").length,
    failed: records.filter((r) => r.status === "failed").length,
  };
}