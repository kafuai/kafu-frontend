import {
  EnterpriseIntelligenceConfidence,
  EnterpriseIntelligencePriority,
} from "../../types/enterpriseIntelligenceTypes";
import { OrganizationMemoryRecordType } from "../types/organizationMemoryTypes";

export interface OrganizationMemoryRecord {
  id: string;
  organizationId: string;
  type: OrganizationMemoryRecordType;
  title: string;
  description: string;
  priority: EnterpriseIntelligencePriority;
  confidence: EnterpriseIntelligenceConfidence;
  tags: string[];
  createdAt: Date;
}

export interface OrganizationMemorySnapshot {
  organizationId: string;
  records: OrganizationMemoryRecord[];
  lastUpdated: Date;
}