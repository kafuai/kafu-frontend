import type { PerformanceMetric } from "./performanceTypes";

export function createPerformanceMetric(
  metric: PerformanceMetric
): PerformanceMetric {
  return metric;
}

export function calculateAveragePerformanceMetric(
  metrics: PerformanceMetric[]
): number {
  if (!metrics.length) return 0;

  return Math.round(
    metrics.reduce(
      (sum, metric) => sum + metric.value,
      0
    ) / metrics.length
  );
}
