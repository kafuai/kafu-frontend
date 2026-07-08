import {
  MarketingAutomationReport,
  MarketingCampaign,
  MarketingPerformanceMetrics,
} from "./marketingAutomationTypes";
import {
  calculateConversionRate,
  calculateROI,
} from "./marketingPerformance";

export function generateMarketingReport(
  campaign: MarketingCampaign,
  metrics: MarketingPerformanceMetrics,
): MarketingAutomationReport {
  const conversionRate = calculateConversionRate(metrics);
  const roi = calculateROI(metrics);

  return {
    campaignId: campaign.id,
    performanceScore: Math.round((conversionRate * 60 + Math.max(roi, 0) * 40) * 100),
    conversionRate,
    roi,
    recommendations: [],
  };
}
