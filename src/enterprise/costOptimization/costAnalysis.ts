import {
  CostAnalysisResult,
  CostCategory,
  CostModel,
} from "./costTypes";

const COST_CATEGORIES: CostCategory[] = [
  "compute",
  "storage",
  "network",
  "database",
  "ai",
  "licensing",
  "operations",
  "support",
  "security",
  "other",
];

export function analyzeCostModel(model: CostModel): CostAnalysisResult {
  const costByCategory = COST_CATEGORIES.reduce(
    (accumulator, category) => {
      accumulator[category] = 0;
      return accumulator;
    },
    {} as Record<CostCategory, number>,
  );

  for (const resource of model.resources) {
    costByCategory[resource.category] += resource.monthlyCost;
  }

  const totalCost = Object.values(costByCategory).reduce(
    (total, cost) => total + cost,
    0,
  );

  const highestCategory = COST_CATEGORIES.reduce<CostCategory | null>(
    (highest, category) => {
      if (!highest) return category;

      return costByCategory[category] > costByCategory[highest]
        ? category
        : highest;
    },
    null,
  );

  return {
    modelId: model.id,
    organizationId: model.organizationId,
    totalCost,
    currency: model.currency,
    costByCategory,
    highestCategory,
    resourceCount: model.resources.length,
    analyzedAt: new Date(),
  };
}