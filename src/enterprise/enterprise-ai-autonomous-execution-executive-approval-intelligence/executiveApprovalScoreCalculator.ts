import { ExecutiveApprovalContext } from "./executiveApprovalContext";

export interface ExecutiveApprovalScoreCalculation {
  approvalScore: number;
  confidenceScore: number;

  strategicAlignmentContribution: number;
  decisionConfidenceContribution: number;
  executionReadinessContribution: number;
  financialImpactContribution: number;
  complianceContribution: number;
  evidenceContribution: number;
  conditionContribution: number;
  availabilityContribution: number;
}

function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function calculateExecutiveApprovalScore(
  context: ExecutiveApprovalContext,
): ExecutiveApprovalScoreCalculation {
  const strategicAlignmentContribution =
    context.strategicAlignmentScore * 0.22;

  const decisionConfidenceContribution =
    context.decisionConfidenceScore * 0.18;

  const executionReadinessContribution =
    context.executionReadinessScore * 0.18;

  const financialImpactContribution =
    context.financialImpactScore * 0.12;

  const complianceContribution =
    context.complianceScore * 0.15;

  const verifiedEvidenceScores = context.evidence
    .filter((item) => item.verified)
    .map((item) => item.confidenceScore);

  const evidenceScore = calculateAverage(
    verifiedEvidenceScores,
  );

  const evidenceContribution = evidenceScore * 0.08;

  const conditionScore =
    context.conditions.length > 0
      ? (
          context.conditions.filter(
            (condition) => condition.satisfied,
          ).length /
          context.conditions.length
        ) * 100
      : 100;

  const conditionContribution = conditionScore * 0.04;

  const availabilityScore =
    context.approvers.length > 0
      ? (
          context.approvers.filter(
            (approver) => approver.available,
          ).length /
          context.approvers.length
        ) * 100
      : 0;

  const availabilityContribution =
    availabilityScore * 0.03;

  let approvalScore =
    strategicAlignmentContribution +
    decisionConfidenceContribution +
    executionReadinessContribution +
    financialImpactContribution +
    complianceContribution +
    evidenceContribution +
    conditionContribution +
    availabilityContribution;

  const blockingConditions = context.conditions.filter(
    (condition) =>
      condition.blocking && !condition.satisfied,
  );

  if (blockingConditions.length > 0) {
    approvalScore -= Math.min(
      30,
      blockingConditions.length * 10,
    );
  }

  if (
    context.requiresBoardApproval &&
    !context.approvers.some(
      (approver) =>
        approver.approvalLevel === "board" &&
        approver.available,
    )
  ) {
    approvalScore -= 15;
  }

  if (
    context.requiresCommitteeApproval &&
    !context.approvers.some(
      (approver) =>
        approver.approvalLevel === "committee" &&
        approver.available,
    )
  ) {
    approvalScore -= 10;
  }

  if (
    context.riskLevel === "severe" &&
    context.complianceScore < 80
  ) {
    approvalScore -= 15;
  }

  const confidenceScore = Math.round(
    calculateAverage([
      context.decisionConfidenceScore,
      evidenceScore,
      context.strategicAlignmentScore,
      context.complianceScore,
    ]),
  );

  return {
    approvalScore: Math.max(
      0,
      Math.min(100, Math.round(approvalScore)),
    ),
    confidenceScore: Math.max(
      0,
      Math.min(100, confidenceScore),
    ),

    strategicAlignmentContribution: Math.round(
      strategicAlignmentContribution,
    ),
    decisionConfidenceContribution: Math.round(
      decisionConfidenceContribution,
    ),
    executionReadinessContribution: Math.round(
      executionReadinessContribution,
    ),
    financialImpactContribution: Math.round(
      financialImpactContribution,
    ),
    complianceContribution: Math.round(
      complianceContribution,
    ),
    evidenceContribution: Math.round(
      evidenceContribution,
    ),
    conditionContribution: Math.round(
      conditionContribution,
    ),
    availabilityContribution: Math.round(
      availabilityContribution,
    ),
  };
}
