import type { OperationalComplianceRecord } from "./operationalCompliance";
import {
  calculateOperationalComplianceMetrics,
  type OperationalComplianceMetrics,
} from "./operationalComplianceMetrics";

export interface OperationalComplianceReport {
  readonly id: string;
  readonly generatedAt: string;
  readonly metrics: OperationalComplianceMetrics;
  readonly nonCompliantRecordIds: readonly string[];
}

export function createOperationalComplianceReport(
  id: string,
  generatedAt: string,
  records: readonly OperationalComplianceRecord[],
): OperationalComplianceReport {
  return {
    id,
    generatedAt,
    metrics: calculateOperationalComplianceMetrics(records),
    nonCompliantRecordIds: records
      .filter((record) => record.status === "non_compliant")
      .map((record) => record.id),
  };
}