export type CapacityDemandPriority = "low" | "medium" | "high" | "critical";

export interface CapacityDemand {
  readonly id: string;
  readonly capability: string;
  readonly targetId: string;
  readonly requiredMinutes: number;
  readonly priority: CapacityDemandPriority;
  readonly dueAt?: string;
}