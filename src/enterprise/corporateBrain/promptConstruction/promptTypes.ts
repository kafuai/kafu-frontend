export type PromptPurpose =
  | "answer"
  | "reasoning"
  | "retrieval"
  | "summarization"
  | "decision_support"
  | "workflow_execution";

export type PromptAudience =
  | "employee"
  | "manager"
  | "executive"
  | "admin"
  | "system";

export type PromptRiskLevel = "low" | "medium" | "high" | "critical";

export interface PromptMetadata {
  tenantId: string;
  purpose: PromptPurpose;
  audience: PromptAudience;
  riskLevel: PromptRiskLevel;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface EnterprisePrompt {
  id: string;
  name: string;
  description: string;
  content: string;
  metadata: PromptMetadata;
}