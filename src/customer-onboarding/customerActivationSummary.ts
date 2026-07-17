import { CustomerActivationPlan } from "./customerActivationPlan";
import { CustomerActivationMilestone } from "./customerActivationMilestones";
import { CustomerActivationReadinessResult } from "./customerActivationReadiness";

export interface CustomerActivationSummary {
  organizationId: string;
  activationOwner: string;
  readinessScore: number;
  readyForActivation: boolean;
  completedMilestones: number;
  totalMilestones: number;
  remainingActions: number;
}

export function buildCustomerActivationSummary(
  plan: CustomerActivationPlan,
  readiness: CustomerActivationReadinessResult,
  milestones: CustomerActivationMilestone[],
): CustomerActivationSummary {
  return {
    organizationId: plan.organizationId,
    activationOwner: plan.activationOwner,
    readinessScore: readiness.readinessScore,
    readyForActivation: readiness.ready,
    completedMilestones: milestones.filter(
      (milestone) => milestone.status === "completed",
    ).length,
    totalMilestones: milestones.length,
    remainingActions: plan.requiredActions.length,
  };
}
