import { MarketingPerformanceMetrics } from "./marketingAutomationTypes";

export function calculateConversionRate(
  metrics: MarketingPerformanceMetrics,
): number {
  if (metrics.clicks === 0) return 0;

  return metrics.conversions / metrics.clicks;
}

export function calculateROI(
  metrics: MarketingPerformanceMetrics,
): number {
  if (metrics.spend === 0) return 0;

  return (metrics.revenue - metrics.spend) / metrics.spend;
}

export function calculateCTR(
  metrics: MarketingPerformanceMetrics,
): number {
  if (metrics.impressions === 0) return 0;

  return metrics.clicks / metrics.impressions;
}
