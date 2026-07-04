import { KnowledgeExtractionSource } from "./knowledgeExtractionTypes";

export type KnowledgeMemoryItem = {
  id: string;
  title: string;
  content: string;
  category?: string;
  metadata?: Record<string, unknown>;
};

export type KnowledgeMemoryAdapterResult = {
  sources: KnowledgeExtractionSource[];
  generatedAt: string;
};