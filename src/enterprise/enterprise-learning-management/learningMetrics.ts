import type { LearningMetric } from "./learningTypes";

export function createLearningMetric(
  metric: LearningMetric
): LearningMetric {
  return metric;
}

export function calculateAverageLearningMetric(
  metrics: LearningMetric[]
): number {
  if (!metrics.length) return 0;

  return Math.round(
    metrics.reduce(
      (sum, metric) => sum + metric.value,
      0
    ) / metrics.length
  );
}
