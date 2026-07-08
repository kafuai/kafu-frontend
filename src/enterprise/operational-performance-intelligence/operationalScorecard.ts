import type {
  OperationalPerformanceMetric,
  OperationalPerformanceSummary,
} from "./operationalPerformanceTypes";
import { benchmarkOperationalPortfolio } from "./operationalBenchmark";
import { generateOperationalInsights } from "./operationalInsights";

export function buildOperationalPerformanceSummary(
  metrics: OperationalPerformanceMetric[]
): OperationalPerformanceSummary {
  if (metrics.length === 0) {
    return {
      totalMetrics: 0,
      excellentMetrics: 0,
      underperformingMetrics: 0,
      urgentInsights: 0,
      averageTargetAchievement: 0,
    };
  }

  const benchmarks = benchmarkOperationalPortfolio(metrics);
  const insights = generateOperationalInsights(metrics);

  return {
    totalMetrics: metrics.length,
    excellentMetrics: metrics.filter((metric) => metric.status === "excellent").length,
    underperformingMetrics: metrics.filter(
      (metric) =>
        metric.status === "underperforming" || metric.status === "critical"
    ).length,
    urgentInsights: insights.filter((insight) => insight.severity === "urgent").length,
    averageTargetAchievement: Math.round(
      benchmarks.reduce((sum, item) => sum + item.achievementRate, 0) /
        benchmarks.length
    ),
  };
}
