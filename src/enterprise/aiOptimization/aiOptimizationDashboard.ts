import { AIOptimizationHistoryRecord } from "./aiOptimizationHistory";
import { AIOptimizationMetricsReport } from "./aiOptimizationMetrics";
import {
  AIOptimizationRecommendation,
  calculateRecommendationScore,
} from "./aiOptimizationRecommendation";

export interface AIOptimizationDashboard {
  organizationId: string;
  totalRecommendations: number;
  activeRecommendations: number;
  topRecommendations: AIOptimizationRecommendation[];
  completedOptimizations: number;
  failedOptimizations: number;
  estimatedCostReductionPercent: number;
  estimatedLatencyReductionPercent: number;
  estimatedTokenReductionPercent: number;
  latestSuccessScore?: number;
  generatedAt: Date;
}

export function buildAIOptimizationDashboard(
  organizationId: string,
  recommendations: AIOptimizationRecommendation[],
  history: AIOptimizationHistoryRecord[],
  latestMetricsReport?: AIOptimizationMetricsReport,
): AIOptimizationDashboard {
  const activeRecommendations = recommendations.filter(
    (recommendation) =>
      recommendation.status === "recommended" ||
      recommendation.status === "approved" ||
      recommendation.status === "in_progress",
  );

  return {
    organizationId,
    totalRecommendations: recommendations.length,
    activeRecommendations: activeRecommendations.length,
    topRecommendations: [...activeRecommendations]
      .sort((a, b) => calculateRecommendationScore(b) - calculateRecommendationScore(a))
      .slice(0, 5),
    completedOptimizations: history.filter((record) => record.status === "validated").length,
    failedOptimizations: history.filter((record) => record.status === "failed").length,
    estimatedCostReductionPercent: sumImpact(
      recommendations.map((recommendation) => recommendation.expectedImpact.costReductionPercent),
    ),
    estimatedLatencyReductionPercent: sumImpact(
      recommendations.map(
        (recommendation) => recommendation.expectedImpact.latencyReductionPercent,
      ),
    ),
    estimatedTokenReductionPercent: sumImpact(
      recommendations.map((recommendation) => recommendation.expectedImpact.tokenReductionPercent),
    ),
    latestSuccessScore: latestMetricsReport?.successScore,
    generatedAt: new Date(),
  };
}

function sumImpact(values: Array<number | undefined>): number {
  return values.reduce<number>((sum, value) => sum + (value ?? 0), 0);
}