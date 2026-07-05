import type { Capacity, CapacityType } from "./capacity";

export interface CreateCapacityOptions {
  id: string;
  resourceId: string;
  type: CapacityType;
  capability: string;
  availableMinutes: number;
}

export function createCapacity(
  options: CreateCapacityOptions,
): Capacity {
  return {
    id: options.id,
    resourceId: options.resourceId,
    type: options.type,
    capability: options.capability,
    availableMinutes: options.availableMinutes,
    effectiveFrom: new Date().toISOString(),
  };
}