import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";
import {
  ExecutiveReasoningSignalType,
} from "../types/executiveReasoningTypes";

export interface ExecutiveReasoningSignal {
  id: string;
  type: ExecutiveReasoningSignalType;
  title: string;
  description: string;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  evidence?: string[];
}

export interface ExecutiveReasoningResult {
  id: string;
  organizationId: string;
  objective: string;
  summary: string;
  signals: ExecutiveReasoningSignal[];
  confidence: EnterpriseIntelligenceConfidence;
  createdAt: Date;
}