import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";
import { ExecutiveRecommendationCategory } from "../types/executiveRecommendationTypes";

export interface ExecutiveRecommendationItem {
  id: string;
  title: string;
  description: string;
  category: ExecutiveRecommendationCategory;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  expectedOutcome: string;
  actions: string[];
  risks?: string[];
}

export interface ExecutiveRecommendationResult {
  id: string;
  organizationId: string;
  objective: string;
  recommendations: ExecutiveRecommendationItem[];
  summary: string;
  confidence: EnterpriseIntelligenceConfidence;
  createdAt: Date;
}