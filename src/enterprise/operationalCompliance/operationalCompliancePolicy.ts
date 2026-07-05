import type { OperationalComplianceRecord } from "./operationalCompliance";

export interface OperationalCompliancePolicy {
  readonly allowCriticalFindings: boolean;
  readonly requireCompliantStatus: boolean;
}

export function satisfiesOperationalCompliancePolicy(
  record: OperationalComplianceRecord,
  policy: OperationalCompliancePolicy,
): boolean {
  if (
    policy.requireCompliantStatus &&
    record.status !== "compliant"
  ) {
    return false;
  }

  if (
    !policy.allowCriticalFindings &&
    record.severity === "critical"
  ) {
    return false;
  }

  return true;
}