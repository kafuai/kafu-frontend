import { PerformanceMetric } from "./performanceTypes";

export type CacheOptimizationResult = {
  metricId: string;
  cacheEfficiency: number;
  recommendation: "increase_ttl" | "reduce_ttl" | "warm_cache" | "keep_current";
};

export function optimizeCacheMetric(
  metric: PerformanceMetric,
): CacheOptimizationResult {
  if (metric.type !== "cache") {
    return {
      metricId: metric.id,
      cacheEfficiency: metric.value,
      recommendation: "keep_current",
    };
  }

  if (metric.value < 50) {
    return {
      metricId: metric.id,
      cacheEfficiency: metric.value,
      recommendation: "warm_cache",
    };
  }

  if (metric.value > 95) {
    return {
      metricId: metric.id,
      cacheEfficiency: metric.value,
      recommendation: "reduce_ttl",
    };
  }

  return {
    metricId: metric.id,
    cacheEfficiency: metric.value,
    recommendation: "keep_current",
  };
}