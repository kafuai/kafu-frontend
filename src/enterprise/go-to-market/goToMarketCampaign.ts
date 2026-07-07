import {
  GoToMarketChannel,
  GoToMarketSegment,
  GoToMarketStatus,
} from "./goToMarketTypes";

export interface GoToMarketCampaign {
  id: string;
  name: string;
  segment: GoToMarketSegment;
  channel: GoToMarketChannel;
  objective: string;
  status: GoToMarketStatus;
  startDate: string;
  endDate: string;
}

export function createGoToMarketCampaign(
  campaign: GoToMarketCampaign,
): GoToMarketCampaign {
  return campaign;
}