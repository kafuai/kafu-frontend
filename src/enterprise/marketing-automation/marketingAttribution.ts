import { MarketingPerformanceMetrics } from "./marketingAutomationTypes";
import { calculateROI } from "./marketingPerformance";

export type MarketingAttributionResult = {
  campaignId: string;
  source: string;
  conversions: number;
  revenue: number;
  roi: number;
};

export function createAttributionResult(
  campaignId: string,
  source: string,
  metrics: MarketingPerformanceMetrics,
): MarketingAttributionResult {
  return {
    campaignId,
    source,
    conversions: metrics.conversions,
    revenue: metrics.revenue,
    roi: calculateROI(metrics),
  };
}