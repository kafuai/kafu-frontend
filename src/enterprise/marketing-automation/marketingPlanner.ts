import { MarketingCampaign } from "./marketingAutomationTypes";

export type MarketingPlan = {
  campaignId: string;
  objective: string;
  channelCount: number;
  segmentCount: number;
};

export function createMarketingPlan(campaign: MarketingCampaign): MarketingPlan {
  return {
    campaignId: campaign.id,
    objective: campaign.objective,
    channelCount: campaign.channels.length,
    segmentCount: campaign.segmentIds.length,
  };
}
