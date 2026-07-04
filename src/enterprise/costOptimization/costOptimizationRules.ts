import { CostCategory, CostSeverity } from "./costTypes";

export type CostOptimizationRuleCondition = {
  category?: CostCategory;
  minimumMonthlyCost?: number;
  environment?: "development" | "staging" | "production";
  tagKey?: string;
  tagValue?: string;
};

export type CostOptimizationRule = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  severity: CostSeverity;
  condition: CostOptimizationRuleCondition;
  recommendation: string;
  estimatedSavingsPercentage: number;
  enabled: boolean;
};

export function costOptimizationRuleMatches(
  rule: CostOptimizationRule,
  resource: {
    category: CostCategory;
    monthlyCost: number;
    environment?: "development" | "staging" | "production";
    tags?: Record<string, string>;
  },
): boolean {
  if (!rule.enabled) return false;

  if (
    rule.condition.category &&
    rule.condition.category !== resource.category
  ) {
    return false;
  }

  if (
    rule.condition.minimumMonthlyCost !== undefined &&
    resource.monthlyCost < rule.condition.minimumMonthlyCost
  ) {
    return false;
  }

  if (
    rule.condition.environment &&
    rule.condition.environment !== resource.environment
  ) {
    return false;
  }

  if (rule.condition.tagKey) {
    const value = resource.tags?.[rule.condition.tagKey];

    if (value === undefined) return false;

    if (
      rule.condition.tagValue !== undefined &&
      value !== rule.condition.tagValue
    ) {
      return false;
    }
  }

  return true;
}