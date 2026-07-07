export type AIReasoningStrategy =
  | "deductive"
  | "inductive"
  | "abductive"
  | "analogical"
  | "causal"
  | "counterfactual"
  | "probabilistic";

export type AIReasoningEvidenceType =
  | "knowledge"
  | "memory"
  | "context"
  | "prediction"
  | "recommendation"
  | "policy"
  | "observation"
  | "external";

export type AIReasoningHypothesisStatus =
  | "candidate"
  | "validated"
  | "rejected";

export type AIReasoningConfidence =
  | "low"
  | "medium"
  | "high"
  | "very_high";

export interface AIReasoningMetadata {
  readonly reasoningId: string;
  readonly organizationId: string;
  readonly createdAt: string;
  readonly createdBy: string;
}

export interface AIReasoningScore {
  readonly confidence: number;
  readonly consistency: number;
  readonly evidenceCoverage: number;
  readonly risk: number;
}

export interface AIReasoningOutcome {
  readonly acceptedHypothesisId: string;
  readonly confidence: AIReasoningConfidence;
  readonly explanation: string;
  readonly recommendations: readonly string[];
}