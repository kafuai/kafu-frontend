import type { ResourceAllocation } from "./resourceAllocation";

export class ResourceAllocationOptimizer {
  optimize(
    allocations: readonly ResourceAllocation[],
  ): readonly ResourceAllocation[] {
    const priorityRank: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return [...allocations].sort((a, b) => {
      const difference =
        priorityRank[b.priority] - priorityRank[a.priority];

      if (difference !== 0) {
        return difference;
      }

      return b.allocatedMinutes - a.allocatedMinutes;
    });
  }
}