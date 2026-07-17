import { CustomerFeedbackRecord } from "./customerFeedbackRecord";
import { CustomerSuccessMilestone } from "./customerSuccessMilestones";
import { CustomerSuccessPlan } from "./customerSuccessPlan";

export interface CustomerSuccessSummary {
  organizationId: string;
  customerName: string;
  customerSuccessOwner: string;
  reviewCadence: string;
  completedMilestones: number;
  totalMilestones: number;
  totalFeedback: number;
  criticalFeedback: number;
  unresolvedFeedback: number;
}

export function buildCustomerSuccessSummary(
  plan: CustomerSuccessPlan,
  milestones: CustomerSuccessMilestone[],
  feedback: CustomerFeedbackRecord[],
): CustomerSuccessSummary {
  return {
    organizationId: plan.organizationId,
    customerName: plan.customerName,
    customerSuccessOwner: plan.customerSuccessOwner,
    reviewCadence: plan.reviewCadence,
    completedMilestones: milestones.filter(
      (milestone) => milestone.status === "completed",
    ).length,
    totalMilestones: milestones.length,
    totalFeedback: feedback.length,
    criticalFeedback: feedback.filter(
      (item) => item.priority === "critical",
    ).length,
    unresolvedFeedback: feedback.filter(
      (item) =>
        item.status !== "resolved" &&
        item.status !== "closed",
    ).length,
  };
}
