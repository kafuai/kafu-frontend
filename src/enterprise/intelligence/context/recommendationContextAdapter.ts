import { EnterpriseContextItem } from "./contextTypes";

export type ExecutiveRecommendationContextInput = {
  recommendationId: string;
  title: string;
  recommendation: string;
  confidence?: number;
  tags?: string[];
};

export function mapExecutiveRecommendationToContext(
  recommendation: ExecutiveRecommendationContextInput,
): EnterpriseContextItem {
  return {
    id: recommendation.recommendationId,
    source: "recommendation_engine",
    title: recommendation.title,
    summary: recommendation.recommendation,
    confidence: recommendation.confidence ?? 0.86,
    tags: recommendation.tags ?? [],
  };
}