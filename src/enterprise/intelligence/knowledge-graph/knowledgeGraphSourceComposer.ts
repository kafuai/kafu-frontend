import { KnowledgeDecisionAdapter } from "./knowledgeDecisionAdapter";
import { KnowledgeDecisionItem } from "./knowledgeDecisionAdapterTypes";
import { KnowledgeMemoryAdapter } from "./knowledgeMemoryAdapter";
import { KnowledgeMemoryItem } from "./knowledgeMemoryAdapterTypes";
import { KnowledgeRecommendationAdapter } from "./knowledgeRecommendationAdapter";
import { KnowledgeRecommendationItem } from "./knowledgeRecommendationAdapterTypes";
import { KnowledgeExtractionSource } from "./knowledgeExtractionTypes";

export type KnowledgeGraphSourceComposerInput = {
  memoryItems?: KnowledgeMemoryItem[];
  decisions?: KnowledgeDecisionItem[];
  recommendations?: KnowledgeRecommendationItem[];
};

export class KnowledgeGraphSourceComposer {
  constructor(
    private readonly memoryAdapter = new KnowledgeMemoryAdapter(),
    private readonly decisionAdapter = new KnowledgeDecisionAdapter(),
    private readonly recommendationAdapter = new KnowledgeRecommendationAdapter(),
  ) {}

  compose(input: KnowledgeGraphSourceComposerInput): KnowledgeExtractionSource[] {
    return [
      ...(input.memoryItems
        ? this.memoryAdapter.adapt(input.memoryItems).sources
        : []),
      ...(input.decisions
        ? this.decisionAdapter.adapt(input.decisions).sources
        : []),
      ...(input.recommendations
        ? this.recommendationAdapter.adapt(input.recommendations).sources
        : []),
    ];
  }
}