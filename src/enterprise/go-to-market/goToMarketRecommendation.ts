export interface GoToMarketRecommendation {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
}

export function createGoToMarketRecommendation(
  recommendation: GoToMarketRecommendation,
): GoToMarketRecommendation {
  return recommendation;
}