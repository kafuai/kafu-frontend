import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";

export type AIRecommendationDomain =
  | "strategy"
  | "operations"
  | "risk"
  | "governance"
  | "people"
  | "technology"
  | "execution"
  | "optimization";

export type AIRecommendationSignalType =
  | "opportunity"
  | "risk"
  | "inefficiency"
  | "constraint"
  | "performance_gap"
  | "alignment_gap"
  | "decision_support";

export interface AIRecommendationSignal {
  id: string;
  type: AIRecommendationSignalType;
  domain: AIRecommendationDomain;
  title: string;
  description: string;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  impactScore: number;
  urgencyScore: number;
}

export interface AIRecommendationContext {
  organizationId: string;
  objective: string;
  domain: AIRecommendationDomain;
  signals: AIRecommendationSignal[];
  requestedBy: string;
  generatedAt?: Date;
}