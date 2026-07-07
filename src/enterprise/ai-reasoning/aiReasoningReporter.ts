import { AIReasoningOutcome } from "./aiReasoningTypes";

export interface AIReasoningReport {
  readonly generatedAt: string;
  readonly acceptedHypothesisId: string;
  readonly confidence: string;
  readonly explanation: string;
  readonly recommendations: readonly string[];
}

export function generateAIReasoningReport(
  outcome: AIReasoningOutcome,
): AIReasoningReport {
  return {
    generatedAt: new Date().toISOString(),
    acceptedHypothesisId: outcome.acceptedHypothesisId,
    confidence: outcome.confidence,
    explanation: outcome.explanation,
    recommendations: [...outcome.recommendations],
  };
}