import type {
  RevenueMetric,
} from "./revenueOperationsTypes";

export interface RevenuePerformance {
  metrics: RevenueMetric[];
  score: number;
}

export function calculatePerformanceScore(
  metrics: RevenueMetric[],
): number {
  if (!metrics.length) {
    return 0;
  }

  return (
    metrics.reduce((sum, metric) => sum + metric.value, 0) /
    metrics.length
  );
}
