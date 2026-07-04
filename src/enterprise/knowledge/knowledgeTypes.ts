export type KnowledgeSourceType =
  | "document"
  | "database"
  | "api"
  | "manual"
  | "workflow"
  | "conversation"
  | "policy"
  | "external";

export type KnowledgeAssetStatus =
  | "draft"
  | "active"
  | "archived"
  | "deprecated"
  | "under_review";

export type KnowledgeSensitivity =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type KnowledgeConfidenceLevel =
  | "low"
  | "medium"
  | "high"
  | "verified";

export interface KnowledgeMetadata {
  ownerId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  version: number;
  tags: string[];
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: KnowledgeSourceType;
  description: string;
  uri?: string;
  enabled: boolean;
  metadata: KnowledgeMetadata;
}

export interface KnowledgeAsset {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceId: string;
  status: KnowledgeAssetStatus;
  sensitivity: KnowledgeSensitivity;
  confidence: KnowledgeConfidenceLevel;
  metadata: KnowledgeMetadata;
}

export interface KnowledgeTaxonomyNode {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  childrenIds: string[];
  tags: string[];
}

export interface KnowledgeClassification {
  assetId: string;
  taxonomyNodeIds: string[];
  sensitivity: KnowledgeSensitivity;
  confidence: KnowledgeConfidenceLevel;
  classifiedAt: string;
  classifiedBy: string;
}

export interface KnowledgeSearchQuery {
  tenantId: string;
  text: string;
  tags?: string[];
  sourceIds?: string[];
  sensitivity?: KnowledgeSensitivity[];
  status?: KnowledgeAssetStatus[];
  limit?: number;
}

export interface KnowledgeSearchResult {
  asset: KnowledgeAsset;
  score: number;
  matchedFields: string[];
}

export interface KnowledgeValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}