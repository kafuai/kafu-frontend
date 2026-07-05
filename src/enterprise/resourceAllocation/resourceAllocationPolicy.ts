import type { ResourceAllocation } from "./resourceAllocation";

export interface ResourceAllocationPolicy {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly enabled: boolean;
}

export function isResourceAllocationAllowed(
  allocation: ResourceAllocation,
  policy: ResourceAllocationPolicy,
): boolean {
  return policy.enabled && allocation.allocatedMinutes > 0;
}