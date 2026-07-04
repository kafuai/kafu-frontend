import { CostAllocationResult, CostModel } from "./costTypes";

export function allocateCostsByOwner(model: CostModel): CostAllocationResult {
  const ownerMap = new Map<
    string,
    {
      totalCost: number;
      resourceIds: string[];
    }
  >();

  let unallocatedCost = 0;

  for (const resource of model.resources) {
    if (!resource.owner) {
      unallocatedCost += resource.monthlyCost;
      continue;
    }

    const current = ownerMap.get(resource.owner) ?? {
      totalCost: 0,
      resourceIds: [],
    };

    current.totalCost += resource.monthlyCost;
    current.resourceIds.push(resource.id);

    ownerMap.set(resource.owner, current);
  }

  return {
    organizationId: model.organizationId,
    modelId: model.id,
    allocations: Array.from(ownerMap.entries()).map(([owner, allocation]) => ({
      owner,
      totalCost: allocation.totalCost,
      resourceIds: allocation.resourceIds,
    })),
    unallocatedCost,
    currency: model.currency,
    allocatedAt: new Date(),
  };
}