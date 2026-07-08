import type {
  RevenueInsight,
  RevenueMetric,
} from "./revenueOperationsTypes";

export interface RevenueAnalytics {
  metrics: RevenueMetric[];
  insights: RevenueInsight[];
}

export function analyticsScore(
  analytics: RevenueAnalytics,
): number {
  if (!analytics.metrics.length) {
    return 0;
  }

  return analytics.metrics.reduce((sum, metric) => sum + metric.value, 0);
}
