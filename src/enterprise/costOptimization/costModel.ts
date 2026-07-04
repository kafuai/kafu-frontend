import { CostCurrency, CostModel, CostPeriod, CostResource } from "./costTypes";

export type CreateCostModelInput = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  period?: CostPeriod;
  currency?: CostCurrency;
  resources?: CostResource[];
};

export function createCostModel(input: CreateCostModelInput): CostModel {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    period: input.period ?? "monthly",
    currency: input.currency ?? "USD",
    resources: input.resources ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function addResourceToCostModel(
  model: CostModel,
  resource: CostResource,
): CostModel {
  return {
    ...model,
    resources: [...model.resources, resource],
    updatedAt: new Date(),
  };
}

export function calculateModelTotalCost(model: CostModel): number {
  return model.resources.reduce(
    (total, resource) => total + resource.monthlyCost,
    0,
  );
}