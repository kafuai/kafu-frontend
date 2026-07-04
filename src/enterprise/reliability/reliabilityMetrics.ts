import { ReliabilityAssessment } from "./reliabilityTypes";

export type ReliabilityMetricsSnapshot = {
  totalTargets: number;
  healthyTargets: number;
  degradedTargets: number;
  unstableTargets: number;
  failedTargets: number;
  capturedAt: Date;
};

export function createReliabilityMetricsSnapshot(
  assessments: ReliabilityAssessment[],
): ReliabilityMetricsSnapshot {
  return {
    totalTargets: assessments.length,
    healthyTargets: assessments.filter(
      (assessment) => assessment.status === "healthy",
    ).length,
    degradedTargets: assessments.filter(
      (assessment) => assessment.status === "degraded",
    ).length,
    unstableTargets: assessments.filter(
      (assessment) => assessment.status === "unstable",
    ).length,
    failedTargets: assessments.filter(
      (assessment) => assessment.status === "failed",
    ).length,
    capturedAt: new Date(),
  };
}