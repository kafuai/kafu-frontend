import { GoToMarketCampaign } from "./goToMarketCampaign";
import { GoToMarketPlan } from "./goToMarketTypes";

export interface GoToMarketStrategicLaunchPlan {
  id: string;
  planId: string;
  launchObjective: string;
  campaigns: GoToMarketCampaign[];
  dependencies: string[];
  owner: string;
}

export function createStrategicLaunchPlan(
  plan: GoToMarketPlan,
  launchObjective: string,
  campaigns: GoToMarketCampaign[],
  dependencies: string[],
  owner: string,
): GoToMarketStrategicLaunchPlan {
  return {
    id: `strategic-launch-${Date.now()}`,
    planId: plan.id,
    launchObjective,
    campaigns,
    dependencies,
    owner,
  };
}