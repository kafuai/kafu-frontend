import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligenceDomain,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";

export type OrganizationMemoryStatus =
  | "idle"
  | "recording"
  | "retrieving"
  | "summarizing"
  | "ready"
  | "failed";

export type OrganizationMemoryRecordType =
  | "insight"
  | "decision"
  | "recommendation"
  | "risk"
  | "objective"
  | "context";

export type OrganizationMemoryContext = {
  organizationId: string;
  domain: EnterpriseIntelligenceDomain;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
};