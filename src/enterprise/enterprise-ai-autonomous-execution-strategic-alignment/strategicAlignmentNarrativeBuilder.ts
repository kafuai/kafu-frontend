import { StrategicAlignmentContext } from "./strategicAlignmentContext";
import { StrategicAlignmentAssessment } from "./strategicAlignmentAssessmentEngine";
import { StrategicAlignmentRecommendation } from "./strategicAlignmentRecommendationEngine";

export interface StrategicAlignmentNarrative {
  headline: string;
  summary: string;
  strategicPosition: string;
  executionGuidance: string;
}

export function buildStrategicAlignmentNarrative(
  context: StrategicAlignmentContext,
  assessment: StrategicAlignmentAssessment,
  recommendation: StrategicAlignmentRecommendation,
): StrategicAlignmentNarrative {
  const alignmentScore =
    assessment.scoreCalculation.alignmentScore;

  const headline =
    assessment.status === "aligned"
      ? "Strategic decision is aligned"
      : assessment.status === "partially_aligned"
        ? "Strategic decision requires targeted alignment"
        : assessment.status === "misaligned"
          ? "Strategic decision requires redesign"
          : "Strategic context is incomplete";

  const strategicPosition =
    `Decision "${context.decisionTitle}" received an enterprise strategic alignment score of ${alignmentScore}%. ` +
    `Status is ${assessment.status.replaceAll("_", " ")} with ${assessment.attentionLevel} attention required.`;

  const summary =
    `${recommendation.executiveSummary} ` +
    `The assessment evaluated strategic objectives, enterprise priorities, portfolios, initiatives, risk constraints, and execution readiness.`;

  const executionGuidance =
    recommendation.recommendedAction;

  return {
    headline,
    summary,
    strategicPosition,
    executionGuidance,
  };
}
