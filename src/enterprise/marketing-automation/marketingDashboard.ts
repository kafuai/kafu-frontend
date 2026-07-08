import { MarketingCampaign } from "./marketingAutomationTypes";

export type MarketingDashboardSummary = {
  totalCampaigns: number;
  activeCampaigns: number;
};

export function buildMarketingDashboard(
  campaigns: MarketingCampaign[],
): MarketingDashboardSummary {
  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === "active").length,
  };
}
