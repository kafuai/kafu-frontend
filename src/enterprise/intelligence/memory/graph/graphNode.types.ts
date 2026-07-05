export interface MemoryGraphNode {
  id: string;
  organizationId: string;

  type: "memory" | "decision" | "insight" | "objective";

  refId: string;

  weight: number;
  createdAt: number;
}