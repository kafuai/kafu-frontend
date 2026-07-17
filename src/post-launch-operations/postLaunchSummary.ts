import { PostLaunchContext } from "./postLaunchContext";
import { PostLaunchHealth } from "./postLaunchHealth";

export interface PostLaunchSummary {
  organizationId: string;
  customerName: string;
  customerSuccessOwner: string;
  status: string;
  healthLevel: string;
  customerAdoptionScore: number;
  serviceHealthScore: number;
  feedbackCount: number;
  operationalIssueCount: number;
  followUpActionCount: number;
}

export function buildPostLaunchSummary(
  context: PostLaunchContext,
  health: PostLaunchHealth,
): PostLaunchSummary {
  return {
    organizationId: context.postLaunch.organizationId,
    customerName: context.postLaunch.customerName,
    customerSuccessOwner: context.postLaunch.customerSuccessOwner,
    status: context.postLaunch.status,
    healthLevel: health.level,
    customerAdoptionScore: health.customerAdoptionScore,
    serviceHealthScore: health.serviceHealthScore,
    feedbackCount: context.customerFeedback.length,
    operationalIssueCount: context.operationalIssues.length,
    followUpActionCount: context.followUpActions.length,
  };
}
