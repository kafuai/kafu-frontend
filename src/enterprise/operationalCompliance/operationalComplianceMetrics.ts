import type { OperationalComplianceRecord } from "./operationalCompliance";

export interface OperationalComplianceMetrics {
  readonly total: number;
  readonly compliant: number;
  readonly nonCompliant: number;
  readonly underReview: number;
}

export function calculateOperationalComplianceMetrics(
  records: readonly OperationalComplianceRecord[],
): OperationalComplianceMetrics {
  return {
    total: records.length,
    compliant: records.filter((r) => r.status === "compliant").length,
    nonCompliant: records.filter((r) => r.status === "non_compliant").length,
    underReview: records.filter((r) => r.status === "under_review").length,
  };
}