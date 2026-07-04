export type ExecutionPriority = "low" | "medium" | "high" | "critical";

export type ExecutionStatus =
  | "pending"
  | "planned"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type ExecutionRiskLevel = "low" | "medium" | "high";

export type ExecutionActionType =
  | "recommendation"
  | "decision"
  | "workflow"
  | "automation"
  | "notification"
  | "integration";

export type ExecutionAction = {
  id: string;
  type: ExecutionActionType;
  title: string;
  description: string;
  owner?: string;
  priority: ExecutionPriority;
  riskLevel: ExecutionRiskLevel;
  estimatedImpact?: string;
  dependencies?: string[];
};

export type ExecutionPlan = {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  status: ExecutionStatus;
  priority: ExecutionPriority;
  actions: ExecutionAction[];
  createdAt: Date;
  updatedAt: Date;
};

export type ExecutionResult = {
  planId: string;
  status: ExecutionStatus;
  completedActions: string[];
  failedActions: string[];
  summary: string;
  executedAt: Date;
};