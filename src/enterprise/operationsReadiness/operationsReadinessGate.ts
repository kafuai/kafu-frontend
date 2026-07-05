import type { OperationsReadinessAssessment } from "./operationsReadinessAssessment";
import {
  satisfiesOperationsReadinessPolicy,
  type OperationsReadinessPolicy,
} from "./operationsReadinessPolicy";

export type OperationsReadinessGateDecision =
  | "approved"
  | "rejected"
  | "requires_review";

export interface OperationsReadinessGateResult {
  readonly assessmentId: string;
  readonly decision: OperationsReadinessGateDecision;
  readonly reasons: readonly string[];
}

export function evaluateOperationsReadinessGate(
  assessment: OperationsReadinessAssessment,
  policy: OperationsReadinessPolicy,
): OperationsReadinessGateResult {
  const reasons: string[] = [];

  if (assessment.overallScore < policy.minimumScore) {
    reasons.push("Assessment score is below the required minimum.");
  }

  if (
    !policy.allowCriticalSignals &&
    assessment.signals.some((signal) => signal.status === "critical")
  ) {
    reasons.push("Assessment contains critical readiness signals.");
  }

  if (!policy.allowBlockers && assessment.blockers.length > 0) {
    reasons.push("Assessment contains unresolved blockers.");
  }

  if (reasons.length === 0) {
    return {
      assessmentId: assessment.id,
      decision: "approved",
      reasons: [],
    };
  }

  if (satisfiesOperationsReadinessPolicy(assessment, policy)) {
    return {
      assessmentId: assessment.id,
      decision: "requires_review",
      reasons,
    };
  }

  return {
    assessmentId: assessment.id,
    decision: "rejected",
    reasons,
  };
}