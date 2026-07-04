import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";

export type ExecutiveDecisionStatus =
  | "idle"
  | "evaluating"
  | "prioritizing"
  | "completed"
  | "failed";

export type ExecutiveDecisionType =
  | "strategic"
  | "operational"
  | "financial"
  | "risk"
  | "people"
  | "technology";

export type ExecutiveDecisionContext = {
  organizationId: string;
  objective: string;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  reasoningSummary: string;
  signals: string[];
};