import { PerformanceBottleneck } from "./performanceBottleneck";
import { OptimizationRule } from "./optimizationRule";

export type OptimizationRecommendation = {
  id: string;
  bottleneckMetricId: string;
  severity: OptimizationRule["severity"];
  recommendation: string;
  createdAt: Date;
};

export function createOptimizationRecommendations(
  bottlenecks: PerformanceBottleneck[],
  rules: OptimizationRule[],
): OptimizationRecommendation[] {
  return bottlenecks.flatMap((bottleneck) =>
    rules
      .filter((rule) => rule.metricType === bottleneck.metric.type)
      .map((rule) => ({
        id: `${bottleneck.metric.id}-${rule.id}`,
        bottleneckMetricId: bottleneck.metric.id,
        severity: rule.severity,
        recommendation: rule.recommendation,
        createdAt: new Date(),
      })),
  );
}