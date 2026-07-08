import { MarketingChannelType } from "./marketingAutomationTypes";

export type MarketingChannelPlan = {
  channel: MarketingChannelType;
  enabled: boolean;
  dailyLimit?: number;
  owner?: string;
};

export function createMarketingChannelPlan(
  channel: MarketingChannelType,
  enabled = true,
): MarketingChannelPlan {
  return {
    channel,
    enabled,
  };
}

export function isChannelAvailable(plan: MarketingChannelPlan): boolean {
  return plan.enabled && (plan.dailyLimit === undefined || plan.dailyLimit > 0);
}

export function selectActiveChannels(plans: MarketingChannelPlan[]): MarketingChannelType[] {
  return plans.filter(isChannelAvailable).map((plan) => plan.channel);
}
