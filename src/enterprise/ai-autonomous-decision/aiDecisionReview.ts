import { AIDecisionGovernanceAssessment } from "./aiDecisionGovernance";

export type AIDecisionReviewStatus =
  | "not_required"
  | "pending_review"
  | "approved"
  | "rejected";

export interface AIDecisionReview {
  decisionId: string;
  status: AIDecisionReviewStatus;
  reviewerRole?: string;
  reason: string;
  createdAt: Date;
}

export function createAIDecisionReview(
  governance: AIDecisionGovernanceAssessment,
): AIDecisionReview {
  if (!governance.requiresHumanReview) {
    return {
      decisionId: governance.decisionId,
      status: "not_required",
      reason: "Human review is not required.",
      createdAt: new Date(),
    };
  }

  return {
    decisionId: governance.decisionId,
    status: "pending_review",
    reviewerRole: "enterprise_governance_reviewer",
    reason: governance.reasons.join(" "),
    createdAt: new Date(),
  };
}