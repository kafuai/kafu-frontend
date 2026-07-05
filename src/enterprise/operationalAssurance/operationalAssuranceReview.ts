import type { OperationalAssuranceRecord } from "./operationalAssurance";

export interface OperationalAssuranceReviewFinding {
  readonly id: string;
  readonly recordId: string;
  readonly severity: "low" | "medium" | "high" | "critical";
  readonly description: string;
}

export function createOperationalAssuranceReviewFindings(
  records: readonly OperationalAssuranceRecord[],
): readonly OperationalAssuranceReviewFinding[] {
  return records
    .filter((record) => record.status !== "verified")
    .map((record) => ({
      id: `${record.id}:review`,
      recordId: record.id,
      severity: record.severity,
      description: `Operational assurance for target "${record.targetId}" requires attention.`,
    }));
}