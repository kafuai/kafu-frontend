import type { HumanCapitalMetric } from "./humanCapitalTypes";

export function createHumanCapitalMetric(
  metric: HumanCapitalMetric
): HumanCapitalMetric {
  return metric;
}

export function calculateAverageHumanCapitalMetric(
  metrics: HumanCapitalMetric[]
): number {
  if (!metrics.length) return 0;

  return Math.round(
    metrics.reduce(
      (sum, metric) => sum + metric.value,
      0
    ) / metrics.length
  );
}
