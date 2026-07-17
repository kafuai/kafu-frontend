import { StrategicAlignmentContext } from "./strategicAlignmentContext";
import {
  StrategicAlignmentLevel,
  StrategicAlignmentStatus,
} from "./strategicAlignmentTypes";
import {
  calculateStrategicAlignmentScore,
  StrategicAlignmentScoreCalculation,
} from "./strategicAlignmentScoreCalculator";

export interface StrategicAlignmentAssessment {
  scoreCalculation: StrategicAlignmentScoreCalculation;
  status: StrategicAlignmentStatus;
  attentionLevel: StrategicAlignmentLevel;
  conflicts: string[];
  blockingConstraints: string[];
}

function determineStatus(
  context: StrategicAlignmentContext,
  alignmentScore: number,
): StrategicAlignmentStatus {
  const hasStrategicContext =
    context.strategicObjectiveIds.length > 0 ||
    context.enterprisePriorityIds.length > 0;

  if (!hasStrategicContext) {
    return "insufficient_context";
  }

  if (
    context.blockingConstraintIds.length > 0 ||
    alignmentScore < 45
  ) {
    return "misaligned";
  }

  if (
    context.conflictingDecisionIds.length > 0 ||
    alignmentScore < 75
  ) {
    return "partially_aligned";
  }

  return "aligned";
}

function determineAttentionLevel(
  context: StrategicAlignmentContext,
  status: StrategicAlignmentStatus,
): StrategicAlignmentLevel {
  if (
    context.blockingConstraintIds.length > 0 ||
    context.riskExposureScore >= 85
  ) {
    return "critical";
  }

  if (
    status === "misaligned" ||
    context.conflictingDecisionIds.length > 1 ||
    context.riskExposureScore >= 70
  ) {
    return "high";
  }

  if (
    status === "partially_aligned" ||
    status === "insufficient_context"
  ) {
    return "medium";
  }

  return "low";
}

export function assessStrategicAlignment(
  context: StrategicAlignmentContext,
): StrategicAlignmentAssessment {
  const scoreCalculation =
    calculateStrategicAlignmentScore(context);

  const status = determineStatus(
    context,
    scoreCalculation.alignmentScore,
  );

  const attentionLevel = determineAttentionLevel(
    context,
    status,
  );

  return {
    scoreCalculation,
    status,
    attentionLevel,
    conflicts: context.conflictingDecisionIds.map(
      (decisionId) =>
        `Strategic decision conflict detected: ${decisionId}`,
    ),
    blockingConstraints: context.blockingConstraintIds.map(
      (constraintId) =>
        `Blocking strategic constraint detected: ${constraintId}`,
    ),
  };
}
