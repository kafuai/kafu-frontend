import {
  createExecutiveApprovalContext,
  CreateExecutiveApprovalContextInput,
  ExecutiveApprovalContext,
} from "./executiveApprovalContext";
import {
  calculateExecutiveApprovalScore,
  ExecutiveApprovalScoreCalculation,
} from "./executiveApprovalScoreCalculator";
import {
  buildExecutiveApprovalRouting,
  calculateRequiredApprovalCount,
} from "./executiveApprovalRoutingEngine";
import {
  buildExecutiveApprovalRecommendation,
  ExecutiveApprovalRecommendation,
} from "./executiveApprovalRecommendationEngine";
import {
  buildExecutiveApprovalNarrative,
  ExecutiveApprovalNarrative,
} from "./executiveApprovalNarrativeBuilder";
import {
  createExecutiveApprovalResult,
  ExecutiveApprovalResult,
} from "./executiveApprovalResult";

export interface ExecutiveApprovalServiceOutput {
  context: ExecutiveApprovalContext;
  scoreCalculation: ExecutiveApprovalScoreCalculation;
  recommendation: ExecutiveApprovalRecommendation;
  narrative: ExecutiveApprovalNarrative;
  result: ExecutiveApprovalResult;
}

export function evaluateExecutiveApproval(
  input: CreateExecutiveApprovalContextInput,
): ExecutiveApprovalServiceOutput {
  const context = createExecutiveApprovalContext(input);

  const scoreCalculation =
    calculateExecutiveApprovalScore(context);

  const routingSteps =
    buildExecutiveApprovalRouting(context);

  const recommendation =
    buildExecutiveApprovalRecommendation(
      context,
      scoreCalculation,
      routingSteps,
    );

  const narrative =
    buildExecutiveApprovalNarrative(
      context,
      scoreCalculation,
      recommendation,
    );

  const result = createExecutiveApprovalResult({
    organizationId: context.organizationId,
    approvalRequestId: context.approvalRequestId,
    decisionId: context.decisionId,

    approvalScore: scoreCalculation.approvalScore,
    confidenceScore: scoreCalculation.confidenceScore,

    status: recommendation.status,
    recommended: recommendation.recommended,

    requiredApprovals:
      calculateRequiredApprovalCount(routingSteps),

    availableApprovers:
      context.approvers.filter(
        (approver) => approver.available,
      ).length,

    routingSteps,

    satisfiedConditions:
      context.conditions.filter(
        (condition) => condition.satisfied,
      ),

    unsatisfiedConditions:
      context.conditions.filter(
        (condition) => !condition.satisfied,
      ),

    blockingConditions:
      context.conditions.filter(
        (condition) =>
          condition.blocking &&
          !condition.satisfied,
      ),

    executiveSummary:
      narrative.summary,

    recommendedAction:
      narrative.approvalGuidance,

    evaluatedAt:
      context.evaluatedAt,
  });

  return {
    context,
    scoreCalculation,
    recommendation,
    narrative,
    result,
  };
}

export class ExecutiveApprovalIntelligenceService {
  evaluate(
    input: CreateExecutiveApprovalContextInput,
  ): ExecutiveApprovalServiceOutput {
    return evaluateExecutiveApproval(input);
  }
}
