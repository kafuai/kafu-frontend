import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";
import { AIRecommendationDomain } from "../types/aiRecommendationTypes";

export interface AIRecommendationAction {
  id: string;
  title: string;
  description: string;
  ownerRole: string;
  expectedOutcome: string;
  priority: EnterpriseIntelligencePriority;
}

export interface AIRecommendationItem {
  id: string;
  organizationId: string;
  domain: AIRecommendationDomain;
  title: string;
  rationale: string;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  score: number;
  actions: AIRecommendationAction[];
  expectedBusinessImpact: string;
  risks: string[];
}

export interface AIRecommendationResult {
  id: string;
  organizationId: string;
  objective: string;
  recommendations: AIRecommendationItem[];
  summary: string;
  generatedAt: Date;
}