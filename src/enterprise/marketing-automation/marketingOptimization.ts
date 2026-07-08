import { MarketingPerformanceMetrics } from "./marketingAutomationTypes";
import { calculateConversionRate, calculateROI } from "./marketingPerformance";

export type MarketingOptimizationRecommendation = {
  type: "budget" | "content" | "audience" | "channel";
  message: string;
  priority: "low" | "medium" | "high";
};

export function generateMarketingOptimizationRecommendations(
  metrics: MarketingPerformanceMetrics,
): MarketingOptimizationRecommendation[] {
  const recommendations: MarketingOptimizationRecommendation[] = [];
  const conversionRate = calculateConversionRate(metrics);
  const roi = calculateROI(metrics);

  if (conversionRate < 0.05) {
    recommendations.push({
      type: "content",
      message: "Improve campaign content and landing-page relevance",
      priority: "high",
    });
  }

  if (roi < 0) {
    recommendations.push({
      type: "budget",
      message: "Reduce spend or reallocate budget to stronger channels",
      priority: "high",
    });
  }

  return recommendations;
}
