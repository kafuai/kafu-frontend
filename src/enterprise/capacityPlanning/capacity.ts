export type CapacityType = "human" | "ai-agent" | "team" | "system";

export interface Capacity {
  readonly id: string;
  readonly resourceId: string;
  readonly type: CapacityType;
  readonly capability: string;
  readonly availableMinutes: number;
  readonly effectiveFrom: string;
}