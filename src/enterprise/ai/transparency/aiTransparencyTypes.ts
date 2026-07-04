export type AITransparencyStatus =
  | "draft"
  | "active"
  | "under_review"
  | "restricted"
  | "retired";

export type AITransparencyAudience =
  | "internal"
  | "executive"
  | "compliance"
  | "customer"
  | "regulator";

export type AITransparencyRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AITransparencyDisclosureLevel =
  | "minimal"
  | "standard"
  | "detailed"
  | "full";

export type AITransparencyExplanationType =
  | "reasoning_summary"
  | "input_factors"
  | "model_limitations"
  | "confidence"
  | "human_review"
  | "data_sources"
  | "policy_constraints";

export interface AITransparencyMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  reviewedBy?: string;
  version: string;
}