import type { BenefitMetric } from "./benefitsTypes";

export function createBenefitMetric(
  metric: BenefitMetric
): BenefitMetric {
  return metric;
}

export function calculateAverageBenefitMetric(
  metrics: BenefitMetric[]
): number {
  if (!metrics.length) return 0;

  return Math.round(
    metrics.reduce(
      (sum, metric) => sum + metric.value,
      0
    ) / metrics.length
  );
}
