export type OperationalComplianceStatus =
  | "compliant"
  | "non_compliant"
  | "under_review";

export type OperationalComplianceSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface OperationalComplianceRecord {
  readonly id: string;
  readonly targetId: string;
  readonly framework: string;
  readonly status: OperationalComplianceStatus;
  readonly severity: OperationalComplianceSeverity;
  readonly assessedAt: string;
}

export function isOperationallyCompliant(
  record: OperationalComplianceRecord,
): boolean {
  return record.status === "compliant";
}

export function requiresComplianceReview(
  record: OperationalComplianceRecord,
): boolean {
  return (
    record.status === "under_review" ||
    record.severity === "critical"
  );
}