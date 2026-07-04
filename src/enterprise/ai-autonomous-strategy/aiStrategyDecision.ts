import { AIStrategyAssessment } from "./aiStrategyAssessment";
import { AIStrategyAlignmentResult } from "./aiStrategyAlignment";

export type AIStrategyDecisionType =
  | "proceed"
  | "revise"
  | "defer"
  | "reject";

export interface AIStrategyDecision {
  assessmentId: string;
  decision: AIStrategyDecisionType;
  confidence: number;
  rationale: string;
  decidedAt: Date;
}

export function createAIStrategyDecision(
  assessment: AIStrategyAssessment,
  alignment: AIStrategyAlignmentResult,
): AIStrategyDecision {
  const confidence = Number(
    (
      (assessment.feasibility.value +
        assessment.strategicFit.value +
        alignment.alignmentScore) /
      3
    ).toFixed(4),
  );

  let decision: AIStrategyDecisionType = "proceed";
  let rationale = "Assessment meets enterprise strategic thresholds.";

  if (alignment.alignmentScore < 0.4) {
    decision = "reject";
    rationale = "Strategic alignment is insufficient.";
  } else if (assessment.feasibility.value < 0.5) {
    decision = "defer";
    rationale = "Feasibility is currently too low.";
  } else if (assessment.strategicFit.value < 0.6) {
    decision = "revise";
    rationale = "Strategic fit should be improved before execution.";
  }

  return {
    assessmentId: assessment.id,
    decision,
    confidence,
    rationale,
    decidedAt: new Date(),
  };
}