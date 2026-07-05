import type { OperationalComplianceRecord } from "./operationalCompliance";

export interface OperationalComplianceReviewFinding {
  readonly id: string;
  readonly recordId: string;
  readonly severity: "low" | "medium" | "high" | "critical";
  readonly description: string;
}

export function createOperationalComplianceReviewFindings(
  records: readonly OperationalComplianceRecord[],
): readonly OperationalComplianceReviewFinding[] {
  return records
    .filter((record) => record.status !== "compliant")
    .map((record) => ({
      id: `${record.id}:review`,
      recordId: record.id,
      severity: record.severity,
      description: `${record.framework} compliance requires attention.`,
    }));
}