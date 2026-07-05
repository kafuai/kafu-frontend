import type { OperationalAssuranceRecord } from "./operationalAssurance";

export interface OperationalAssurancePolicy {
  readonly requireVerifiedStatus: boolean;
  readonly allowCriticalSeverity: boolean;
}

export function satisfiesOperationalAssurancePolicy(
  record: OperationalAssuranceRecord,
  policy: OperationalAssurancePolicy,
): boolean {
  if (
    policy.requireVerifiedStatus &&
    record.status !== "verified"
  ) {
    return false;
  }

  if (
    !policy.allowCriticalSeverity &&
    record.severity === "critical"
  ) {
    return false;
  }

  return true;
}