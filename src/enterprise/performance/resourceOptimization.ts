import { PerformanceMetric } from "./performanceTypes";

export type ResourceOptimizationResult = {
  metricId: string;
  resourceType: PerformanceMetric["type"];
  currentValue: number;
  action: "scale_up" | "scale_down" | "rebalance" | "observe";
};

export function optimizeResourceMetric(
  metric: PerformanceMetric,
): ResourceOptimizationResult {
  if (metric.value >= 90) {
    return {
      metricId: metric.id,
      resourceType: metric.type,
      currentValue: metric.value,
      action: "scale_up",
    };
  }

  if (metric.value <= 20) {
    return {
      metricId: metric.id,
      resourceType: metric.type,
      currentValue: metric.value,
      action: "scale_down",
    };
  }

  return {
    metricId: metric.id,
    resourceType: metric.type,
    currentValue: metric.value,
    action: "observe",
  };
}