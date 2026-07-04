export type AITrustLevel = "very_low" | "low" | "medium" | "high" | "very_high";

export type AITrustSignalCategory =
  | "accuracy"
  | "explainability"
  | "transparency"
  | "provenance"
  | "reliability"
  | "safety"
  | "fairness"
  | "human_oversight"
  | "compliance";

export type AITrustSignalStatus = "active" | "degraded" | "failed" | "unknown";

export interface AITrustEvidence {
  id: string;
  source: string;
  description: string;
  confidence: number;
  capturedAt: Date;
}

export interface AITrustContext {
  organizationId: string;
  modelId: string;
  useCaseId?: string;
  environment: string;
  evaluatedAt: Date;
}