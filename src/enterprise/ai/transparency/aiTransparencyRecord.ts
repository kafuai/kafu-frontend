import {
  AITransparencyAudience,
  AITransparencyDisclosureLevel,
  AITransparencyRiskLevel,
  AITransparencyStatus,
  AITransparencyMetadata,
} from "./aiTransparencyTypes";

export interface AITransparencyRecord {
  id: string;
  organizationId: string;
  modelId: string;
  useCaseId: string;
  title: string;
  purpose: string;
  status: AITransparencyStatus;
  audience: AITransparencyAudience;
  riskLevel: AITransparencyRiskLevel;
  disclosureLevel: AITransparencyDisclosureLevel;
  isAIGenerated: boolean;
  requiresUserDisclosure: boolean;
  requiresHumanReviewDisclosure: boolean;
  summary: string;
  limitations: string[];
  metadata: AITransparencyMetadata;
}

export interface CreateAITransparencyRecordInput {
  id: string;
  organizationId: string;
  modelId: string;
  useCaseId: string;
  title: string;
  purpose: string;
  audience: AITransparencyAudience;
  riskLevel: AITransparencyRiskLevel;
  disclosureLevel: AITransparencyDisclosureLevel;
  isAIGenerated: boolean;
  requiresUserDisclosure: boolean;
  requiresHumanReviewDisclosure: boolean;
  summary: string;
  limitations?: string[];
  createdBy: string;
  version?: string;
}

export function createAITransparencyRecord(
  input: CreateAITransparencyRecordInput,
): AITransparencyRecord {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    modelId: input.modelId,
    useCaseId: input.useCaseId,
    title: input.title,
    purpose: input.purpose,
    status: "draft",
    audience: input.audience,
    riskLevel: input.riskLevel,
    disclosureLevel: input.disclosureLevel,
    isAIGenerated: input.isAIGenerated,
    requiresUserDisclosure: input.requiresUserDisclosure,
    requiresHumanReviewDisclosure: input.requiresHumanReviewDisclosure,
    summary: input.summary,
    limitations: input.limitations ?? [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
      version: input.version ?? "1.0.0",
    },
  };
}