import { KnowledgeExtractionSource } from "./knowledgeExtractionTypes";

export type KnowledgeDecisionItem = {
  id: string;
  title: string;
  summary: string;
  impact?: string;
  metadata?: Record<string, unknown>;
};

export type KnowledgeDecisionAdapterResult = {
  sources: KnowledgeExtractionSource[];
  generatedAt: string;
};