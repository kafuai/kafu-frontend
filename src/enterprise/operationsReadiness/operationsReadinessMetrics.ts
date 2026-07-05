import type { OperationsReadinessAssessment } from "./operationsReadinessAssessment";

export interface OperationsReadinessMetrics {
  readonly totalAssessments: number;
  readonly readyAssessments: number;
  readonly optimizedAssessments: number;
  readonly averageScore: number;
}

export function calculateOperationsReadinessMetrics(
  assessments: readonly OperationsReadinessAssessment[],
): OperationsReadinessMetrics {
  const totalAssessments = assessments.length;

  if (totalAssessments === 0) {
    return {
      totalAssessments: 0,
      readyAssessments: 0,
      optimizedAssessments: 0,
      averageScore: 0,
    };
  }

  const readyAssessments = assessments.filter(
    (assessment) => assessment.level === "ready",
  ).length;

  const optimizedAssessments = assessments.filter(
    (assessment) => assessment.level === "optimized",
  ).length;

  const averageScore = Math.round(
    assessments.reduce(
      (sum, assessment) => sum + assessment.overallScore,
      0,
    ) / totalAssessments,
  );

  return {
    totalAssessments,
    readyAssessments,
    optimizedAssessments,
    averageScore,
  };
}