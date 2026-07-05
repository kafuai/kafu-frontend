import type { OperationsReadinessAssessment } from "./operationsReadinessAssessment";

export interface OperationsReadinessPolicy {
  readonly minimumScore: number;
  readonly allowCriticalSignals: boolean;
  readonly allowBlockers: boolean;
}

export function satisfiesOperationsReadinessPolicy(
  assessment: OperationsReadinessAssessment,
  policy: OperationsReadinessPolicy,
): boolean {
  if (assessment.overallScore < policy.minimumScore) {
    return false;
  }

  if (
    !policy.allowCriticalSignals &&
    assessment.signals.some((signal) => signal.status === "critical")
  ) {
    return false;
  }

  if (!policy.allowBlockers && assessment.blockers.length > 0) {
    return false;
  }

  return true;
}