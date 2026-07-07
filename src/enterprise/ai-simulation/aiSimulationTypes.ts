export type AISimulationStatus =
  | "draft"
  | "ready"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type AISimulationScope =
  | "decision"
  | "plan"
  | "workflow"
  | "operation"
  | "strategy"
  | "risk"
  | "resource"
  | "organization";

export type AISimulationPriority = "low" | "medium" | "high" | "critical";

export type AISimulationConfidence = "low" | "medium" | "high" | "verified";

export type AISimulationRiskLevel = "low" | "medium" | "high" | "critical";

export interface AISimulationMetadata {
  tenantId: string;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}
