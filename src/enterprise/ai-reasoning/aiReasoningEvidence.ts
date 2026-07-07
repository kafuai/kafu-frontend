import { AIReasoningEvidenceType } from "./aiReasoningTypes";

export interface AIReasoningEvidence {
  readonly id: string;
  readonly source: string;

  readonly type: AIReasoningEvidenceType;

  readonly summary: string;

  readonly confidence: number;

  readonly relevance: number;

  readonly payload: Record<string, unknown>;
}

export function calculateEvidenceWeight(
  evidence: AIReasoningEvidence,
): number {
  return Number(
    (
      evidence.confidence * 0.6 +
      evidence.relevance * 0.4
    ).toFixed(2),
  );
}