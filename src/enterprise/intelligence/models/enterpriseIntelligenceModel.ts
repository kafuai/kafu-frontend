import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligenceDomain,
  EnterpriseIntelligencePriority,
} from "../types/enterpriseIntelligenceTypes";

export interface EnterpriseIntelligenceModel {
  id: string;

  title: string;

  description: string;

  domain: EnterpriseIntelligenceDomain;

  priority: EnterpriseIntelligencePriority;

  confidence: EnterpriseIntelligenceConfidence;

  createdAt: Date;

  updatedAt: Date;

  metadata?: Record<string, unknown>;
}