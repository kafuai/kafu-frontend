import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligenceDomain,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";

export type ExecutiveReasoningStatus =
  | "idle"
  | "collecting_context"
  | "analyzing"
  | "evaluating"
  | "completed"
  | "failed";

export type ExecutiveReasoningSignalType =
  | "opportunity"
  | "risk"
  | "constraint"
  | "insight"
  | "recommendation";

export type ExecutiveReasoningContext = {
  organizationId: string;
  domain: EnterpriseIntelligenceDomain;
  objective: string;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  inputs?: Record<string, unknown>;
};