import { detectPerformanceBottlenecks } from "./performanceBottleneck";
import { createOptimizationRecommendations } from "./optimizationRecommendation";
import { OptimizationRule } from "./optimizationRule";
import { PerformanceMetric } from "./performanceTypes";

export type PerformanceOptimizationEngineResult = {
  bottleneckCount: number;
  recommendationCount: number;
};

export function runPerformanceOptimizationEngine(
  metrics: PerformanceMetric[],
  threshold: number,
  rules: OptimizationRule[],
): PerformanceOptimizationEngineResult {
  const bottlenecks = detectPerformanceBottlenecks(metrics, threshold);
  const recommendations = createOptimizationRecommendations(bottlenecks, rules);

  return {
    bottleneckCount: bottlenecks.length,
    recommendationCount: recommendations.length,
  };
}