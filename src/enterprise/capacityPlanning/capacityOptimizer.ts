import type { Capacity } from "./capacity";
import type { CapacityDemand } from "./capacityDemand";

export class CapacityOptimizer {
  optimize(
    capacities: readonly Capacity[],
    demands: readonly CapacityDemand[],
  ): readonly Capacity[] {
    const prioritizedDemands = [...demands].sort(
      (a, b) => b.requiredMinutes - a.requiredMinutes,
    );

    if (prioritizedDemands.length === 0) {
      return [...capacities];
    }

    return [...capacities].sort(
      (a, b) => b.availableMinutes - a.availableMinutes,
    );
  }
}