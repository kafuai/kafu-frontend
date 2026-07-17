export interface GoToMarketLaunchPlan {
  organizationId: string;
  launchOwner: string;
  targetLaunchDate: string;
  launchObjectives: string[];
  targetSegments: string[];
  launchChannels: string[];
  successMetrics: string[];
}

export function createGoToMarketLaunchPlan(
  plan: GoToMarketLaunchPlan,
): GoToMarketLaunchPlan {
  return {
    ...plan,
    launchObjectives: [...plan.launchObjectives],
    targetSegments: [...plan.targetSegments],
    launchChannels: [...plan.launchChannels],
    successMetrics: [...plan.successMetrics],
  };
}
