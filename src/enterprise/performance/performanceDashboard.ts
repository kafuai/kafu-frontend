import { PerformanceMetric } from "./performanceTypes";

export type PerformanceDashboard = {
  totalMetrics: number;
  averageValue: number;
  highestValue: number;
  lowestValue: number;
  generatedAt: Date;
};

export function createPerformanceDashboard(
  metrics: PerformanceMetric[],
): PerformanceDashboard {
  if (metrics.length === 0) {
    return {
      totalMetrics: 0,
      averageValue: 0,
      highestValue: 0,
      lowestValue: 0,
      generatedAt: new Date(),
    };
  }

  const values = metrics.map((metric) => metric.value);

  return {
    totalMetrics: metrics.length,
    averageValue:
      values.reduce((sum, value) => sum + value, 0) / values.length,
    highestValue: Math.max(...values),
    lowestValue: Math.min(...values),
    generatedAt: new Date(),
  };
}