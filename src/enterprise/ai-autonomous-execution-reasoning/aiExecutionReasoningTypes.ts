export type AIExecutionReasoningMode =
  | "deductive"
  | "inductive"
  | "abductive"
  | "causal"
  | "comparative"
  | "constraint_based"
  | "risk_aware";

export type AIExecutionReasoningSignalType =
  | "knowledge_gap"
  | "conflicting_evidence"
  | "execution_risk"
  | "decision_pressure"
  | "policy_constraint"
  | "optimization_opportunity"
  | "dependency_uncertainty";

export type AIExecutionReasoningConfidenceLevel =
  | "very_low"
  | "low"
  | "medium"
  | "high"
  | "very_high";

export type AIExecutionReasoningPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIExecutionReasoningOutcome =
  | "proceed"
  | "revise"
  | "defer"
  | "escalate"
  | "block";

export interface AIExecutionReasoningEvidence {
  id: string;
  source: string;
  summary: string;
  confidence: number;
  relevance: number;
  createdAt: Date;
}

export interface AIExecutionReasoningConstraint {
  id: string;
  name: string;
  description: string;
  severity: AIExecutionReasoningPriority;
  required: boolean;
}

export interface AIExecutionReasoningAssumption {
  id: string;
  statement: string;
  confidence: number;
  riskIfWrong: AIExecutionReasoningPriority;
}

export interface AIExecutionReasoningSignal {
  id: string;
  type: AIExecutionReasoningSignalType;
  description: string;
  urgency: number;
  confidence: number;
  detectedAt: Date;
}

export interface AIExecutionReasoningScore {
  confidence: number;
  evidenceStrength: number;
  constraintFit: number;
  riskExposure: number;
  executionReadiness: number;
}