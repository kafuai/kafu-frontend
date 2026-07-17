import { GoToMarketLaunchMilestone } from "./goToMarketLaunchMilestones";
import { GoToMarketLaunchPlan } from "./goToMarketLaunchPlan";
import { GoToMarketReadinessResult } from "./goToMarketReadiness";

export interface GoToMarketLaunchSummary {
  organizationId: string;
  launchOwner: string;
  targetLaunchDate: string;
  readinessScore: number;
  readyForLaunch: boolean;
  completedMilestones: number;
  totalMilestones: number;
  blockerCount: number;
}

export function buildGoToMarketLaunchSummary(
  plan: GoToMarketLaunchPlan,
  readiness: GoToMarketReadinessResult,
  milestones: GoToMarketLaunchMilestone[],
): GoToMarketLaunchSummary {
  return {
    organizationId: plan.organizationId,
    launchOwner: plan.launchOwner,
    targetLaunchDate: plan.targetLaunchDate,
    readinessScore: readiness.readinessScore,
    readyForLaunch: readiness.readyForLaunch,
    completedMilestones: milestones.filter(
      (milestone) => milestone.status === "completed",
    ).length,
    totalMilestones: milestones.length,
    blockerCount: readiness.blockers.length,
  };
}
