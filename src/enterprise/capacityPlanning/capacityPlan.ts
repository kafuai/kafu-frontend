import type { Capacity } from "./capacity";
import type { CapacityDemand } from "./capacityDemand";

export interface CapacityPlan {
  readonly id: string;
  readonly generatedAt: string;
  readonly capacities: readonly Capacity[];
  readonly demands: readonly CapacityDemand[];
  readonly totalAvailableMinutes: number;
  readonly totalRequiredMinutes: number;
  readonly remainingMinutes: number;
}

export function createCapacityPlan(
  id: string,
  capacities: readonly Capacity[],
  demands: readonly CapacityDemand[],
): CapacityPlan {
  const totalAvailableMinutes = capacities.reduce(
    (total, capacity) => total + capacity.availableMinutes,
    0,
  );

  const totalRequiredMinutes = demands.reduce(
    (total, demand) => total + demand.requiredMinutes,
    0,
  );

  return {
    id,
    generatedAt: new Date().toISOString(),
    capacities,
    demands,
    totalAvailableMinutes,
    totalRequiredMinutes,
    remainingMinutes: totalAvailableMinutes - totalRequiredMinutes,
  };
}