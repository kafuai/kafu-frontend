import {
  KnowledgeRecommendationAdapterResult,
  KnowledgeRecommendationItem,
} from "./knowledgeRecommendationAdapterTypes";

export class KnowledgeRecommendationAdapter {
  adapt(
    recommendations: KnowledgeRecommendationItem[],
  ): KnowledgeRecommendationAdapterResult {
    return {
      sources: recommendations.map((item) => ({
        id: item.id,
        type: "recommendation",
        title: item.title,
        content: [
          item.recommendation,
          item.rationale ? `Rationale: ${item.rationale}` : undefined,
          item.priority ? `Priority: ${item.priority}` : undefined,
        ]
          .filter(Boolean)
          .join("\n"),
        metadata: {
          priority: item.priority,
          ...item.metadata,
        },
      })),
      generatedAt: new Date().toISOString(),
    };
  }
}