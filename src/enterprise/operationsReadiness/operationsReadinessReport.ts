import type { OperationsReadinessAssessment } from "./operationsReadinessAssessment";
import {
  calculateOperationsReadinessMetrics,
  type OperationsReadinessMetrics,
} from "./operationsReadinessMetrics";

export interface OperationsReadinessReport {
  readonly id: string;
  readonly generatedAt: string;
  readonly metrics: OperationsReadinessMetrics;
  readonly blockedAssessmentIds: readonly string[];
  readonly recommendedActions: readonly string[];
}

export function createOperationsReadinessReport(
  id: string,
  generatedAt: string,
  assessments: readonly OperationsReadinessAssessment[],
): OperationsReadinessReport {
  const metrics = calculateOperationsReadinessMetrics(assessments);

  const blockedAssessmentIds = assessments
    .filter(
      (assessment) =>
        assessment.blockers.length > 0 ||
        assessment.signals.some((signal) => signal.status === "critical"),
    )
    .map((assessment) => assessment.id);

  const recommendedActions = assessments.flatMap(
    (assessment) => assessment.recommendations,
  );

  return {
    id,
    generatedAt,
    metrics,
    blockedAssessmentIds,
    recommendedActions,
  };
}