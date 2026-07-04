import { KnowledgeExtractionSource } from "./knowledgeExtractionTypes";

export type KnowledgeRecommendationItem = {
  id: string;
  title: string;
  recommendation: string;
  rationale?: string;
  priority?: "low" | "medium" | "high" | "critical";
  metadata?: Record<string, unknown>;
};

export type KnowledgeRecommendationAdapterResult = {
  sources: KnowledgeExtractionSource[];
  generatedAt: string;
};