import {
  AIExecutionVerificationEvidence,
  AIExecutionVerificationEvidenceType,
} from "./aiExecutionVerificationTypes";

export interface CreateAIExecutionVerificationEvidenceInput {
  id: string;
  type: AIExecutionVerificationEvidenceType;
  source: string;
  confidence: number;
  weight?: number;
  observedAt?: string;
  summary: string;
  metadata?: Record<string, string | number | boolean>;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function createAIExecutionVerificationEvidence(
  input: CreateAIExecutionVerificationEvidenceInput
): AIExecutionVerificationEvidence {
  return {
    id: input.id,
    type: input.type,
    source: input.source,
    confidence: clampScore(input.confidence),
    weight: clampScore(input.weight ?? 1),
    observedAt: input.observedAt ?? new Date().toISOString(),
    summary: input.summary,
    metadata: input.metadata,
  };
}

export function calculateAIExecutionVerificationEvidenceStrength(
  evidence: AIExecutionVerificationEvidence
): number {
  return clampScore(evidence.confidence * evidence.weight);
}

export function filterReliableAIExecutionVerificationEvidence(
  evidence: AIExecutionVerificationEvidence[],
  minimumStrength = 0.6
): AIExecutionVerificationEvidence[] {
  return evidence.filter(
    (item) =>
      calculateAIExecutionVerificationEvidenceStrength(item) >= minimumStrength
  );
}