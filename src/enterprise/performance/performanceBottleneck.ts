import {
  PerformanceMetric,
  PerformanceSeverity,
} from "./performanceTypes";

export type PerformanceBottleneck = {
  metric: PerformanceMetric;
  severity: PerformanceSeverity;
  reason: string;
};

export function detectPerformanceBottlenecks(
  metrics: PerformanceMetric[],
  threshold: number,
): PerformanceBottleneck[] {
  return metrics
    .filter((metric) => metric.value > threshold)
    .map((metric) => ({
      metric,
      severity: metric.value > threshold * 2 ? "critical" : "high",
      reason: `Metric exceeds threshold (${threshold}).`,
    }));
}