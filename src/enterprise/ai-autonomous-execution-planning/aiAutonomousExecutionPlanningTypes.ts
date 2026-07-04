export type AIExecutionPlanningPriority = "low" | "medium" | "high" | "critical";

export type AIExecutionPlanningStatus =
  | "draft"
  | "ready"
  | "blocked"
  | "in_progress"
  | "completed"
  | "cancelled";

export type AIExecutionPlanningRiskLevel = "low" | "medium" | "high" | "critical";

export type AIExecutionStepType =
  | "analysis"
  | "validation"
  | "coordination"
  | "automation"
  | "human_review"
  | "deployment"
  | "monitoring"
  | "rollback";

export type AIExecutionStepDependencyType =
  | "requires_completion"
  | "requires_approval"
  | "requires_signal"
  | "requires_resource";

export interface AIExecutionPlanningAuditMetadata {
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  sourceMilestone?: string;
  traceId?: string;
}