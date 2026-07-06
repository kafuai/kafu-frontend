export type KnowledgeReasoningMode =
  | "deductive"
  | "inductive"
  | "abductive"
  | "causal"
  | "contextual";

export type KnowledgeReasoningConfidence =
  | "low"
  | "medium"
  | "high"
  | "verified";

export type KnowledgeReasoningSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface KnowledgeReasoningContext {
  readonly tenantId: string;
  readonly requesterId: string;
  readonly sourceModule: string;
  readonly reasoningMode: KnowledgeReasoningMode;
  readonly timestamp: string;
}