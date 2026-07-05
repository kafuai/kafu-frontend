import type { ResourceAllocation } from "./resourceAllocation";

export interface ResourceAllocationPlan {
  readonly id: string;
  readonly generatedAt: string;
  readonly allocations: readonly ResourceAllocation[];
  readonly totalAllocatedMinutes: number;
}

export function createResourceAllocationPlan(
  id: string,
  allocations: readonly ResourceAllocation[],
): ResourceAllocationPlan {
  return {
    id,
    generatedAt: new Date().toISOString(),
    allocations,
    totalAllocatedMinutes: allocations.reduce(
      (total, allocation) => total + allocation.allocatedMinutes,
      0,
    ),
  };
}