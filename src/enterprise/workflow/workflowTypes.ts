export type WorkflowStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "failed"
  | "cancelled";

export type WorkflowStepStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed"
  | "skipped";

export type WorkflowPriority = "low" | "medium" | "high" | "critical";

export type WorkflowStep = {
  id: string;
  name: string;
  description?: string;
  status: WorkflowStepStatus;
  dependsOn?: string[];
};

export type WorkflowDefinition = {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  priority: WorkflowPriority;
  status: WorkflowStatus;
  steps: WorkflowStep[];
  createdAt: Date;
  updatedAt: Date;
};