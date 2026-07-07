import {
  GoToMarketChannel,
  GoToMarketPlan,
  GoToMarketSegment,
  GoToMarketStatus,
} from "./goToMarketTypes";

export interface GoToMarketLaunchChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  owner: string;
}

export interface GoToMarketLaunchPlan {
  id: string;
  planId: string;
  launchName: string;
  targetSegment: GoToMarketSegment;
  primaryChannel: GoToMarketChannel;
  status: GoToMarketStatus;
  checklist: GoToMarketLaunchChecklistItem[];
  launchDate: string;
}

export function createGoToMarketLaunchPlan(
  plan: GoToMarketPlan,
  launchName: string,
  targetSegment: GoToMarketSegment,
  primaryChannel: GoToMarketChannel,
  launchDate: string,
): GoToMarketLaunchPlan {
  return {
    id: `gtm-launch-${Date.now()}`,
    planId: plan.id,
    launchName,
    targetSegment,
    primaryChannel,
    status: "ready",
    checklist: [],
    launchDate,
  };
}

export function isGoToMarketLaunchReady(
  launchPlan: GoToMarketLaunchPlan,
): boolean {
  return (
    launchPlan.status === "ready" &&
    launchPlan.checklist.every((item) => item.completed)
  );
}