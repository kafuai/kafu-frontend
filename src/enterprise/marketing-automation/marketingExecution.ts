import { MarketingCampaign, MarketingJourney } from "./marketingAutomationTypes";
import { canLaunchCampaign } from "./marketingCampaign";
import { isJourneyExecutable } from "./marketingJourney";

export type MarketingExecutionPlan = {
  campaignId: string;
  ready: boolean;
  blockers: string[];
};

export function buildMarketingExecutionPlan(
  campaign: MarketingCampaign,
  journey: MarketingJourney,
): MarketingExecutionPlan {
  const blockers: string[] = [];

  if (!canLaunchCampaign(campaign)) blockers.push("Campaign is not launch-ready");
  if (!isJourneyExecutable(journey)) blockers.push("Journey is not executable");

  return {
    campaignId: campaign.id,
    ready: blockers.length === 0,
    blockers,
  };
}
