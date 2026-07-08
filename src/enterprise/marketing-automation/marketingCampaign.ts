import { MarketingCampaign } from "./marketingAutomationTypes";

export function createMarketingCampaign(input: MarketingCampaign): MarketingCampaign {
  return {
    ...input,
    channels: Array.from(new Set(input.channels)),
    segmentIds: Array.from(new Set(input.segmentIds)),
  };
}

export function canLaunchCampaign(campaign: MarketingCampaign): boolean {
  return (
    campaign.status === "scheduled" &&
    campaign.channels.length > 0 &&
    campaign.segmentIds.length > 0
  );
}

export function pauseMarketingCampaign(campaign: MarketingCampaign): MarketingCampaign {
  return {
    ...campaign,
    status: campaign.status === "active" ? "paused" : campaign.status,
  };
}
