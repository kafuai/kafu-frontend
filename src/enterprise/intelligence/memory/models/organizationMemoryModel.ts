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

  // FIX: timestamp instead of Date
  createdAt: number;
}

export interface OrganizationMemorySnapshot {
  organizationId: string;
  records: OrganizationMemoryRecord[];

  // FIX: timestamp instead of Date
  lastUpdated: number;
}