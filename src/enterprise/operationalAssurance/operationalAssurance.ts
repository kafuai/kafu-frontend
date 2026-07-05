export type OperationalAssuranceStatus =
  | "verified"
  | "pending"
  | "failed";

export type OperationalAssuranceSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface OperationalAssuranceRecord {
  readonly id: string;
  readonly targetId: string;
  readonly status: OperationalAssuranceStatus;
  readonly severity: OperationalAssuranceSeverity;
  readonly verifiedAt: string;
}

export function isOperationallyVerified(
  record: OperationalAssuranceRecord,
): boolean {
  return record.status === "verified";
}

export function requiresOperationalAssurance(
  record: OperationalAssuranceRecord,
): boolean {
  return (
    record.status !== "verified" ||
    record.severity === "critical"
  );
}