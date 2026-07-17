import { ExecutiveApprovalContext } from "./executiveApprovalContext";
import { ExecutiveApprovalScoreCalculation } from "./executiveApprovalScoreCalculator";
import {
  ExecutiveApprovalStatus,
  ExecutiveApprovalRoutingStep,
} from "./executiveApprovalTypes";

export interface ExecutiveApprovalRecommendation {
  status: ExecutiveApprovalStatus;
  recommended: boolean;
  executiveSummary: string;
  recommendedAction: string;
}

export function buildExecutiveApprovalRecommendation(
  context: ExecutiveApprovalContext,
  scoreCalculation: ExecutiveApprovalScoreCalculation,
  routingSteps: ExecutiveApprovalRoutingStep[],
): ExecutiveApprovalRecommendation {
  const blockingConditions = context.conditions.filter(
    (condition) =>
      condition.blocking && !condition.satisfied,
  );

  const unavailableRequiredLevels = routingSteps.filter(
    (step) =>
      step.requiredApprovals === 0 ||
      step.approverIds.length <
        step.requiredApprovals,
  );

  if (blockingConditions.length > 0) {
    return {
      status: "not_recommended",
      recommended: false,
      executiveSummary:
        `Approval is not recommended because ${blockingConditions.length} blocking condition(s) remain unresolved.`,
      recommendedAction:
        "Resolve all blocking conditions and resubmit the decision for executive approval.",
    };
  }

  if (unavailableRequiredLevels.length > 0) {
    return {
      status: "escalated",
      recommended: false,
      executiveSummary:
        "The decision cannot complete its approval route because one or more required approval levels lack available approvers.",
      recommendedAction:
        "Assign available approvers or escalate the request to the appropriate executive authority.",
    };
  }

  if (
    context.riskLevel === "severe" &&
    context.complianceScore < 80
  ) {
    return {
      status: "not_recommended",
      recommended: false,
      executiveSummary:
        "The decision carries severe risk and does not meet the minimum compliance threshold.",
      recommendedAction:
        "Complete compliance remediation and obtain an updated risk assessment before approval.",
    };
  }

  if (
    scoreCalculation.approvalScore >= 80 &&
    scoreCalculation.confidenceScore >= 75
  ) {
    return {
      status: "recommended",
      recommended: true,
      executiveSummary:
        `The decision is recommended for approval with an approval score of ${scoreCalculation.approvalScore}% and confidence of ${scoreCalculation.confidenceScore}%.`,
      recommendedAction:
        "Proceed through the generated executive approval route.",
    };
  }

  if (scoreCalculation.approvalScore >= 60) {
    return {
      status: "conditionally_recommended",
      recommended: true,
      executiveSummary:
        `The decision is conditionally recommended with an approval score of ${scoreCalculation.approvalScore}%.`,
      recommendedAction:
        "Address remaining non-blocking conditions and complete the required approval route before execution.",
    };
  }

  return {
    status: "not_recommended",
    recommended: false,
    executiveSummary:
      `The decision is not recommended for approval because its approval score is ${scoreCalculation.approvalScore}%.`,
    recommendedAction:
      "Strengthen strategic alignment, execution readiness, evidence quality, compliance, or financial justification before resubmission.",
  };
}
