import type {
  OperationalInsight,
  OperationalPerformanceMetric,
} from "./operationalPerformanceTypes";
import { benchmarkOperationalMetric } from "./operationalBenchmark";

export function generateOperationalInsights(
  metrics: OperationalPerformanceMetric[]
): OperationalInsight[] {
  return metrics.flatMap((metric) => {
    const benchmark = benchmarkOperationalMetric(metric);
    const insights: OperationalInsight[] = [];

    if (!benchmark.targetMet) {
      insights.push({
        id: `${metric.id}-target-gap`,
        metricId: metric.id,
        title: "Operational target gap detected",
        summary: `${metric.name} is below target by ${benchmark.gapToTarget} ${metric.unit}.`,
        recommendedAction: "Review ownership, bottlenecks, and resource allocation.",
        severity: benchmark.achievementRate < 80 ? "high" : "medium",
      });
    }

    if (metric.trend === "declining") {
      insights.push({
        id: `${metric.id}-declining-trend`,
        metricId: metric.id,
        title: "Declining operational trend",
        summary: `${metric.name} is trending in the wrong direction.`,
        recommendedAction: "Trigger root-cause analysis and corrective action planning.",
        severity: metric.status === "underperforming" ? "urgent" : "high",
      });
    }

    return insights;
  });
}
