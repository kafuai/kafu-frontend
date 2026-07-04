import {
  KnowledgeConfidenceLevel,
  KnowledgeNodeType,
  KnowledgeRelationType,
} from "./knowledgeGraphTypes";

export type KnowledgeExtractionSourceType =
  | "executive_report"
  | "organization_memory"
  | "decision"
  | "recommendation"
  | "manual_input";

export type KnowledgeExtractionSource = {
  id: string;
  type: KnowledgeExtractionSourceType;
  title: string;
  content: string;
  metadata?: Record<string, unknown>;
};

export type ExtractedKnowledgeEntity = {
  id: string;
  nodeType: KnowledgeNodeType;
  title: string;
  description?: string;
  confidence: KnowledgeConfidenceLevel;
  sourceId: string;
};

export type ExtractedKnowledgeRelation = {
  id: string;
  sourceEntityId: string;
  targetEntityId: string;
  relationType: KnowledgeRelationType;
  confidence: KnowledgeConfidenceLevel;
  description?: string;
  sourceId: string;
};

export type KnowledgeExtractionResult = {
  sourceId: string;
  entities: ExtractedKnowledgeEntity[];
  relations: ExtractedKnowledgeRelation[];
  extractedAt: string;
};