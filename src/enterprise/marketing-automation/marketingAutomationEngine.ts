import { MarketingCampaign } from "./marketingAutomationTypes";
import { buildMarketingExecutionPlan } from "./marketingExecution";
import { generateMarketingReport } from "./marketingReport";
import { MarketingJourney, MarketingPerformanceMetrics } from "./marketingAutomationTypes";

export function executeMarketingAutomation(
  campaign: MarketingCampaign,
  journey: MarketingJourney,
  metrics: MarketingPerformanceMetrics,
) {
  const execution = buildMarketingExecutionPlan(campaign, journey);

  return {
    execution,
    report: generateMarketingReport(campaign, metrics),
  };
}
