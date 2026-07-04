import {
  AIOptimizationRecommendation,
  calculateRecommendationScore,
} from "./aiOptimizationRecommendation";
import { AIOptimizationPlan, createAIOptimizationPlan } from "./aiOptimizationPlan";
import { AIOptimizationPriority } from "./aiOptimizationTypes";

export interface BuildAIOptimizationPlanInput {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  recommendations: AIOptimizationRecommendation[];
  createdBy: string;
  maxRecommendations?: number;
}

export function buildAIOptimizationPlan(
  input: BuildAIOptimizationPlanInput,
): AIOptimizationPlan {
  const selectedRecommendations = [...input.recommendations]
    .filter((recommendation) => recommendation.status === "recommended")
    .sort((a, b) => calculateRecommendationScore(b) - calculateRecommendationScore(a))
    .slice(0, input.maxRecommendations ?? 10);

  return createAIOptimizationPlan({
    id: input.id,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    priority: resolveOptimizationPlanPriority(selectedRecommendations),
    recommendations: selectedRecommendations,
    createdBy: input.createdBy,
  });
}

export function resolveOptimizationPlanPriority(
  recommendations: AIOptimizationRecommendation[],
): AIOptimizationPriority {
  if (
    recommendations.some(
      (recommendation) =>
        recommendation.impactLevel === "transformational" &&
        recommendation.confidence >= 0.85,
    )
  ) {
    return "critical";
  }

  if (
    recommendations.some(
      (recommendation) =>
        recommendation.impactLevel === "high" && recommendation.confidence >= 0.75,
    )
  ) {
    return "high";
  }

  if (recommendations.length > 0) {
    return "medium";
  }

  return "low";
}