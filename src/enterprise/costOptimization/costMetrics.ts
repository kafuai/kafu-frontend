import { CostAnalysisResult } from "./costTypes";
import { CostOptimizationEngineResult } from "./costOptimizationEngine";

export type CostMetricsSnapshot = {
  organizationId: string;
  modelId: string;
  totalCost: number;
  estimatedMonthlySavings: number;
  savingsRate: number;
  resourceCount: number;
  recommendationCount: number;
  optimizedResources: number;
  measuredAt: Date;
};

export function createCostMetricsSnapshot(
  analysis: CostAnalysisResult,
  optimization: CostOptimizationEngineResult,
): CostMetricsSnapshot {
  const savingsRate =
    analysis.totalCost === 0
      ? 0
      : optimization.estimatedMonthlySavings / analysis.totalCost;

  return {
    organizationId: analysis.organizationId,
    modelId: analysis.modelId,
    totalCost: analysis.totalCost,
    estimatedMonthlySavings: optimization.estimatedMonthlySavings,
    savingsRate,
    resourceCount: analysis.resourceCount,
    recommendationCount: optimization.recommendations.length,
    optimizedResources: optimization.optimizedResources,
    measuredAt: new Date(),
  };
}