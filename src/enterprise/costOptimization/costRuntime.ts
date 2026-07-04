import { analyzeCostModel } from "./costAnalysis";
import { allocateCostsByOwner } from "./costAllocation";
import { BudgetPolicy } from "./budgetPolicy";
import { evaluateBudget } from "./budgetEngine";
import { CostOptimizationRule } from "./costOptimizationRules";
import { optimizeCostModel } from "./costOptimizationEngine";
import { createCostMetricsSnapshot } from "./costMetrics";
import {
  CostAllocationResult,
  CostAnalysisResult,
  CostModel,
} from "./costTypes";
import { BudgetEvaluationResult } from "./budgetEngine";
import { CostOptimizationEngineResult } from "./costOptimizationEngine";
import { CostMetricsSnapshot } from "./costMetrics";

export type CostRuntimeInput = {
  model: CostModel;
  budgetPolicy?: BudgetPolicy;
  optimizationRules?: CostOptimizationRule[];
};

export type CostRuntimeSnapshot = {
  analysis: CostAnalysisResult;
  allocation: CostAllocationResult;
  budget?: BudgetEvaluationResult;
  optimization: CostOptimizationEngineResult;
  metrics: CostMetricsSnapshot;
  executedAt: Date;
};

export function executeCostOptimizationRuntime(
  input: CostRuntimeInput,
): CostRuntimeSnapshot {
  const analysis = analyzeCostModel(input.model);
  const allocation = allocateCostsByOwner(input.model);

  const budget = input.budgetPolicy
    ? evaluateBudget(input.budgetPolicy, analysis.totalCost)
    : undefined;

  const optimization = optimizeCostModel(
    input.model,
    input.optimizationRules ?? [],
  );

  const metrics = createCostMetricsSnapshot(analysis, optimization);

  return {
    analysis,
    allocation,
    budget,
    optimization,
    metrics,
    executedAt: new Date(),
  };
}