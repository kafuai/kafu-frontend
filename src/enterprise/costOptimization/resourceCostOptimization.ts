import {
  costOptimizationRuleMatches,
  CostOptimizationRule,
} from "./costOptimizationRules";
import {
  CostRecommendation,
  createCostRecommendation,
} from "./costRecommendations";
import { CostResource } from "./costTypes";

export type ResourceCostOptimizationResult = {
  resourceId: string;
  organizationId: string;
  recommendations: CostRecommendation[];
  estimatedMonthlySavings: number;
  optimizedAt: Date;
};

export function optimizeResourceCost(
  resource: CostResource,
  rules: CostOptimizationRule[],
): ResourceCostOptimizationResult {
  const recommendations = rules
    .filter((rule) => costOptimizationRuleMatches(rule, resource))
    .map((rule) => createCostRecommendation(resource, rule));

  return {
    resourceId: resource.id,
    organizationId: resource.organizationId,
    recommendations,
    estimatedMonthlySavings: recommendations.reduce(
      (total, recommendation) =>
        total + recommendation.estimatedMonthlySavings,
      0,
    ),
    optimizedAt: new Date(),
  };
}