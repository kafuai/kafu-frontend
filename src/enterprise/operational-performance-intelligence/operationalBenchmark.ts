import type { OperationalPerformanceMetric } from "./operationalPerformanceTypes";

export interface OperationalBenchmarkResult {
  metricId: string;
  achievementRate: number;
  gapToTarget: number;
  targetMet: boolean;
}

export function benchmarkOperationalMetric(
  metric: OperationalPerformanceMetric
): OperationalBenchmarkResult {
  const achievementRate =
    metric.targetValue === 0
      ? 0
      : Math.round((metric.currentValue / metric.targetValue) * 100);

  return {
    metricId: metric.id,
    achievementRate,
    gapToTarget: Math.round((metric.targetValue - metric.currentValue) * 100) / 100,
    targetMet: metric.currentValue >= metric.targetValue,
  };
}

export function benchmarkOperationalPortfolio(
  metrics: OperationalPerformanceMetric[]
): OperationalBenchmarkResult[] {
  return metrics.map(benchmarkOperationalMetric);
}
