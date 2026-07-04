import { CostOptimizationRule } from "./costOptimizationRules";
import { optimizeResourceCost } from "./resourceCostOptimization";
import {
  CostModel,
  CostResource,
} from "./costTypes";
import { CostRecommendation } from "./costRecommendations";

export type CostOptimizationEngineResult = {
  modelId: string;
  organizationId: string;
  recommendations: CostRecommendation[];
  estimatedMonthlySavings: number;
  optimizedResources: number;
  evaluatedResources: number;
  optimizedAt: Date;
};

export function optimizeCostModel(
  model: CostModel,
  rules: CostOptimizationRule[],
): CostOptimizationEngineResult {
  const resourceResults = model.resources.map((resource: CostResource) =>
    optimizeResourceCost(resource, rules),
  );

  const recommendations = resourceResults.flatMap(
    (result) => result.recommendations,
  );

  return {
    modelId: model.id,
    organizationId: model.organizationId,
    recommendations,
    estimatedMonthlySavings: recommendations.reduce(
      (total, recommendation) =>
        total + recommendation.estimatedMonthlySavings,
      0,
    ),
    optimizedResources: resourceResults.filter(
      (result) => result.recommendations.length > 0,
    ).length,
    evaluatedResources: model.resources.length,
    optimizedAt: new Date(),
  };
}