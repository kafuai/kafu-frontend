import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";

export type ExecutiveRecommendationStatus =
  | "idle"
  | "analyzing_decision"
  | "generating"
  | "completed"
  | "failed";

export type ExecutiveRecommendationCategory =
  | "strategic_action"
  | "operational_improvement"
  | "risk_mitigation"
  | "technology_enablement"
  | "people_alignment"
  | "governance";

export type ExecutiveRecommendationContext = {
  organizationId: string;
  objective: string;
  decisionTitle: string;
  decisionRationale: string;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  risks?: string[];
};