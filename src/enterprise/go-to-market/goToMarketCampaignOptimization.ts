export interface GoToMarketCampaignPerformance {
  campaignId: string;
  conversionRate: number;
  roi: number;
}

export function selectTopCampaigns(
  campaigns: GoToMarketCampaignPerformance[],
  minimumROI = 1,
): GoToMarketCampaignPerformance[] {
  return campaigns.filter((campaign) => campaign.roi >= minimumROI);
}