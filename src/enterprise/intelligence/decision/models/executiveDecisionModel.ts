import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";
import { ExecutiveDecisionType } from "../types/executiveDecisionTypes";

export interface ExecutiveDecisionOption {
  id: string;
  title: string;
  description: string;
  type: ExecutiveDecisionType;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  expectedImpact: string;
  risks?: string[];
}

export interface ExecutiveDecisionResult {
  id: string;
  organizationId: string;
  objective: string;
  recommendedOption: ExecutiveDecisionOption;
  alternatives: ExecutiveDecisionOption[];
  rationale: string;
  confidence: EnterpriseIntelligenceConfidence;
  createdAt: Date;
}