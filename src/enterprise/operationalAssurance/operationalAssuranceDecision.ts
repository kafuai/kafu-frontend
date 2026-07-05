import type { OperationalAssuranceRecord } from "./operationalAssurance";
import {
  satisfiesOperationalAssurancePolicy,
  type OperationalAssurancePolicy,
} from "./operationalAssurancePolicy";

export type OperationalAssuranceDecision =
  | "approved"
  | "rejected"
  | "requires_review";

export interface OperationalAssuranceDecisionResult {
  readonly recordId: string;
  readonly decision: OperationalAssuranceDecision;
  readonly reasons: readonly string[];
}

export function evaluateOperationalAssuranceDecision(
  record: OperationalAssuranceRecord,
  policy: OperationalAssurancePolicy,
): OperationalAssuranceDecisionResult {
  const reasons: string[] = [];

  if (
    policy.requireVerifiedStatus &&
    record.status !== "verified"
  ) {
    reasons.push("Operational assurance has not been verified.");
  }

  if (
    !policy.allowCriticalSeverity &&
    record.severity === "critical"
  ) {
    reasons.push("Critical assurance finding detected.");
  }

  return {
    recordId: record.id,
    decision:
      reasons.length === 0
        ? "approved"
        : satisfiesOperationalAssurancePolicy(record, policy)
          ? "requires_review"
          : "rejected",
    reasons,
  };
}