import type { CompensationMetric } from "./compensationTypes";

export function createCompensationMetric(
  metric: CompensationMetric
): CompensationMetric {
  return metric;
}

export function calculateAverageCompensationMetric(
  metrics: CompensationMetric[]
): number {
  if (!metrics.length) return 0;

  return Math.round(
    metrics.reduce(
      (sum, metric) => sum + metric.value,
      0
    ) / metrics.length
  );
}
