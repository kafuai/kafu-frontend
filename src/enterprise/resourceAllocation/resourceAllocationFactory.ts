import type {
  ResourceAllocation,
  ResourceAllocationPriority,
} from "./resourceAllocation";

export interface CreateResourceAllocationOptions {
  id: string;
  resourceId: string;
  resourceType: string;
  capability: string;
  targetId: string;
  allocatedMinutes: number;
  priority?: ResourceAllocationPriority;
}

export function createResourceAllocation(
  options: CreateResourceAllocationOptions,
): ResourceAllocation {
  return {
    id: options.id,
    resourceId: options.resourceId,
    resourceType: options.resourceType,
    capability: options.capability,
    targetId: options.targetId,
    allocatedMinutes: options.allocatedMinutes,
    priority: options.priority ?? "medium",
    allocatedAt: new Date().toISOString(),
  };
}