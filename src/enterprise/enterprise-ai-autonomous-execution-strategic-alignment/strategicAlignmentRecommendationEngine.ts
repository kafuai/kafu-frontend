import { StrategicAlignmentContext } from "./strategicAlignmentContext";
import { StrategicAlignmentAssessment } from "./strategicAlignmentAssessmentEngine";

export interface StrategicAlignmentRecommendation {
  recommendedAction: string;
  executiveSummary: string;
}

export function buildStrategicAlignmentRecommendation(
  context: StrategicAlignmentContext,
  assessment: StrategicAlignmentAssessment,
): StrategicAlignmentRecommendation {
  const alignmentScore =
    assessment.scoreCalculation.alignmentScore;

  if (assessment.blockingConstraints.length > 0) {
    return {
      recommendedAction:
        "Do not authorize autonomous execution until all blocking strategic constraints are resolved and the decision is reassessed.",
      executiveSummary:
        `Strategic decision "${context.decisionTitle}" received an alignment score of ${alignmentScore}%. ` +
        `${assessment.blockingConstraints.length} blocking constraint(s) prevent safe strategic execution.`,
    };
  }

  if (assessment.status === "insufficient_context") {
    return {
      recommendedAction:
        "Connect the decision to explicit strategic objectives and enterprise priorities before execution approval.",
      executiveSummary:
        `Strategic decision "${context.decisionTitle}" cannot be fully assessed because its strategic objective and enterprise priority context is incomplete.`,
    };
  }

  if (assessment.status === "misaligned") {
    return {
      recommendedAction:
        "Return the decision for strategic redesign, resolve conflicts, and improve alignment before autonomous execution.",
      executiveSummary:
        `Strategic decision "${context.decisionTitle}" is currently misaligned with an alignment score of ${alignmentScore}%. ` +
        `${assessment.conflicts.length} strategic conflict(s) require executive attention.`,
    };
  }

  if (assessment.status === "partially_aligned") {
    return {
      recommendedAction:
        "Proceed only after executive review of identified alignment gaps, resource readiness, and decision conflicts.",
      executiveSummary:
        `Strategic decision "${context.decisionTitle}" is partially aligned with an alignment score of ${alignmentScore}%. ` +
        "Execution may proceed after targeted strategic corrections and executive validation.",
    };
  }

  if (
    context.executionReadinessScore < 70 ||
    context.resourceAvailabilityScore < 60
  ) {
    return {
      recommendedAction:
        "Maintain strategic approval but delay execution until readiness and resource availability reach acceptable levels.",
      executiveSummary:
        `Strategic decision "${context.decisionTitle}" is strategically aligned at ${alignmentScore}%, ` +
        "but execution readiness or resource availability requires improvement.",
    };
  }

  return {
    recommendedAction:
      "Authorize progression to autonomous execution planning under existing governance and monitoring controls.",
    executiveSummary:
      `Strategic decision "${context.decisionTitle}" is aligned with enterprise direction at ${alignmentScore}% ` +
      "and is suitable for progression toward autonomous execution.",
  };
}
