import { AIRecommendationResult } from "../models/aiRecommendationModel";

export interface AIRecommendationReport {
  id: string;
  organizationId: string;
  objective: string;
  summary: string;
  totalRecommendations: number;
  highPriorityCount: number;
  criticalPriorityCount: number;
  averageScore: number;
  generatedAt: Date;
}

export function createAIRecommendationReport(
  result: AIRecommendationResult,
): AIRecommendationReport {
  const total = result.recommendations.length;

  const averageScore =
    total === 0
      ? 0
      : Math.round(
          result.recommendations.reduce(
            (sum, recommendation) => sum + recommendation.score,
            0,
          ) / total,
        );

  return {
    id: `${result.id}-report`,
    organizationId: result.organizationId,
    objective: result.objective,
    summary: result.summary,
    totalRecommendations: total,
    highPriorityCount: result.recommendations.filter(
      (recommendation) => recommendation.priority === "high",
    ).length,
    criticalPriorityCount: result.recommendations.filter(
      (recommendation) => recommendation.priority === "critical",
    ).length,
    averageScore,
    generatedAt: new Date(),
  };
}