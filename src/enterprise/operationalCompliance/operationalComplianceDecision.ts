import type { OperationalComplianceRecord } from "./operationalCompliance";
import {
  satisfiesOperationalCompliancePolicy,
  type OperationalCompliancePolicy,
} from "./operationalCompliancePolicy";

export type OperationalComplianceDecision =
  | "approved"
  | "rejected"
  | "requires_review";

export interface OperationalComplianceDecisionResult {
  readonly recordId: string;
  readonly decision: OperationalComplianceDecision;
  readonly reasons: readonly string[];
}

export function evaluateOperationalComplianceDecision(
  record: OperationalComplianceRecord,
  policy: OperationalCompliancePolicy,
): OperationalComplianceDecisionResult {
  const reasons: string[] = [];

  if (
    policy.requireCompliantStatus &&
    record.status !== "compliant"
  ) {
    reasons.push("Compliance status is not compliant.");
  }

  if (
    !policy.allowCriticalFindings &&
    record.severity === "critical"
  ) {
    reasons.push("Critical compliance finding detected.");
  }

  return {
    recordId: record.id,
    decision:
      reasons.length === 0
        ? "approved"
        : satisfiesOperationalCompliancePolicy(record, policy)
          ? "requires_review"
          : "rejected",
    reasons,
  };
}