import type { OperationalAssuranceRecord } from "./operationalAssurance";
import {
  calculateOperationalAssuranceMetrics,
  type OperationalAssuranceMetrics,
} from "./operationalAssuranceMetrics";

export interface OperationalAssuranceReport {
  readonly id: string;
  readonly generatedAt: string;
  readonly metrics: OperationalAssuranceMetrics;
  readonly failedRecordIds: readonly string[];
}

export function createOperationalAssuranceReport(
  id: string,
  generatedAt: string,
  records: readonly OperationalAssuranceRecord[],
): OperationalAssuranceReport {
  return {
    id,
    generatedAt,
    metrics: calculateOperationalAssuranceMetrics(records),
    failedRecordIds: records
      .filter((record) => record.status === "failed")
      .map((record) => record.id),
  };
}