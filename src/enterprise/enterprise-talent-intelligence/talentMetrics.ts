import type { TalentMetric } from "./talentTypes";

export function createTalentMetric(
  metric: TalentMetric
): TalentMetric {
  return metric;
}

export function calculateAverageTalentMetric(
  metrics: TalentMetric[]
): number {
  if (!metrics.length) return 0;

  return Math.round(
    metrics.reduce(
      (sum, metric) => sum + metric.value,
      0
    ) / metrics.length
  );
}
