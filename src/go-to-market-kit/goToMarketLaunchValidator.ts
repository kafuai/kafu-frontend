import { GoToMarketLaunchMilestone } from "./goToMarketLaunchMilestones";
import { GoToMarketLaunchPlan } from "./goToMarketLaunchPlan";

export interface GoToMarketLaunchValidationInput {
  plan: GoToMarketLaunchPlan;
  milestones: GoToMarketLaunchMilestone[];
}

export function validateGoToMarketLaunch(
  input: GoToMarketLaunchValidationInput,
): string[] {
  const issues: string[] = [];

  if (!input.plan.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!input.plan.launchOwner.trim()) {
    issues.push("Launch owner is required.");
  }

  if (!input.plan.targetLaunchDate.trim()) {
    issues.push("Target launch date is required.");
  }

  if (input.plan.launchObjectives.length === 0) {
    issues.push("At least one launch objective is required.");
  }

  if (input.plan.targetSegments.length === 0) {
    issues.push("At least one target segment is required.");
  }

  if (input.plan.launchChannels.length === 0) {
    issues.push("At least one launch channel is required.");
  }

  if (input.plan.successMetrics.length === 0) {
    issues.push("At least one launch success metric is required.");
  }

  if (input.milestones.length === 0) {
    issues.push("At least one launch milestone is required.");
  }

  return issues;
}
