export type ResponsePurpose =
  | "answer"
  | "summary"
  | "recommendation"
  | "decision_support"
  | "workflow_guidance";

export type ResponseTone =
  | "formal"
  | "professional"
  | "concise"
  | "detailed"
  | "executive";

export interface EnterpriseResponse {
  id: string;
  tenantId: string;
  purpose: ResponsePurpose;
  tone: ResponseTone;
  content: string;
  generatedAt: string;
}