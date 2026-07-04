import { CostOptimizationRule } from "./costOptimizationRules";
import { CostResource } from "./costTypes";

export type CostRecommendation = {
  id: string;
  organizationId: string;
  resourceId: string;
  ruleId: string;
  title: string;
  description: string;
  estimatedMonthlySavings: number;
  severity: CostOptimizationRule["severity"];
  createdAt: Date;
};

export function createCostRecommendation(
  resource: CostResource,
  rule: CostOptimizationRule,
): CostRecommendation {
  return {
    id: `${resource.id}:${rule.id}`,
    organizationId: resource.organizationId,
    resourceId: resource.id,
    ruleId: rule.id,
    title: rule.name,
    description: rule.recommendation,
    estimatedMonthlySavings:
      resource.monthlyCost * rule.estimatedSavingsPercentage,
    severity: rule.severity,
    createdAt: new Date(),
  };
}