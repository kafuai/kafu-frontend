import { AIReasoningEvidence } from "./aiReasoningEvidence";
import { deriveAIReasoningConfidence } from "./aiReasoningConfidence";
import { AIReasoningHypothesis } from "./aiReasoningHypothesis";
import { resolveAIReasoningConflicts } from "./aiReasoningConflictResolver";
import { scoreAIReasoningHypothesis } from "./aiReasoningScoring";
import { AIReasoningOutcome } from "./aiReasoningTypes";

export interface AIReasoningEngineInput {
  readonly hypotheses: readonly AIReasoningHypothesis[];
  readonly evidence: readonly AIReasoningEvidence[];
}

export function executeAIReasoning(
  input: AIReasoningEngineInput,
): AIReasoningOutcome {
  const scored = input.hypotheses.map((hypothesis) => ({
    ...hypothesis,
    score: scoreAIReasoningHypothesis(hypothesis, input.evidence),
  }));

  const ranked = resolveAIReasoningConflicts(scored);
  const winner = ranked[0];

  if (!winner || !winner.score) {
    throw new Error("Unable to determine a reasoning outcome.");
  }

  return {
    acceptedHypothesisId: winner.id,
    confidence: deriveAIReasoningConfidence(winner.score),
    explanation: winner.rationale,
    recommendations: [
      `Apply ${winner.strategy} reasoning.`,
      "Monitor new evidence.",
      "Re-evaluate when additional signals become available.",
    ],
  };
}