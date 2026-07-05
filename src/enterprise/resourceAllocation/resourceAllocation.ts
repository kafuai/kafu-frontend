export type ResourceAllocationPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ResourceAllocation {
  readonly id: string;
  readonly resourceId: string;
  readonly resourceType: string;
  readonly capability: string;
  readonly targetId: string;
  readonly priority: ResourceAllocationPriority;
  readonly allocatedMinutes: number;
  readonly allocatedAt: string;
}