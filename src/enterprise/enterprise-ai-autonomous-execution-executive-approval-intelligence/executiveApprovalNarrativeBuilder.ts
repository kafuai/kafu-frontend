import { ExecutiveApprovalContext } from "./executiveApprovalContext";
import { ExecutiveApprovalRecommendation } from "./executiveApprovalRecommendationEngine";
import { ExecutiveApprovalScoreCalculation } from "./executiveApprovalScoreCalculator";

export interface ExecutiveApprovalNarrative {
  headline: string;
  summary: string;
  executivePosition: string;
  approvalGuidance: string;
}

export function buildExecutiveApprovalNarrative(
  context: ExecutiveApprovalContext,
  scoreCalculation: ExecutiveApprovalScoreCalculation,
  recommendation: ExecutiveApprovalRecommendation,
): ExecutiveApprovalNarrative {
  const headline =
    recommendation.recommended
      ? "Executive approval recommended"
      : "Executive approval requires attention";

  const executivePosition =
    `Decision "${context.decisionTitle}" achieved an approval score of ${scoreCalculation.approvalScore}% ` +
    `with confidence ${scoreCalculation.confidenceScore}%.`;

  const summary =
    `${recommendation.executiveSummary} ` +
    `Evaluation included strategic alignment, execution readiness, compliance, financial impact, evidence quality and approval routing readiness.`;

  return {
    headline,
    summary,
    executivePosition,
    approvalGuidance: recommendation.recommendedAction,
  };
}
