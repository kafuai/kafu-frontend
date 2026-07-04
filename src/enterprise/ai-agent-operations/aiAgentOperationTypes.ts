export type AIAgentOperationTaskStatus =
  | "pending"
  | "assigned"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "skipped";

export type AIAgentOperationPriority = "low" | "normal" | "high" | "critical";

export type AIAgentOperationExecutionMode =
  | "sequential"
  | "parallel"
  | "priority";

export type AIAgentOperationFailureStrategy =
  | "fail-fast"
  | "continue"
  | "skip-dependent";

export type AIAgentOperationAssignmentStatus =
  | "assigned"
  | "unassigned"
  | "blocked";

export interface AIAgentOperationMetadata {
  createdBy?: string;
  source?: string;
  tags?: string[];
  [key: string]: unknown;
}