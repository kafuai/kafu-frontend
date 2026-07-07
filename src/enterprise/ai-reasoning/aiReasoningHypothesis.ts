import {
  AIReasoningHypothesisStatus,
  AIReasoningScore,
  AIReasoningStrategy,
} from "./aiReasoningTypes";

export interface AIReasoningHypothesis {
  readonly id: string;
  readonly statement: string;
  readonly rationale: string;
  readonly strategy: AIReasoningStrategy;
  readonly evidenceIds: readonly string[];
  readonly risks: readonly string[];
  readonly status: AIReasoningHypothesisStatus;
  readonly score?: AIReasoningScore;
}

export function createAIReasoningHypothesis(
  input: AIReasoningHypothesis,
): AIReasoningHypothesis {
  return Object.freeze({
    ...input,
    evidenceIds: [...input.evidenceIds],
    risks: [...input.risks],
    score: input.score ? { ...input.score } : undefined,
  });
}