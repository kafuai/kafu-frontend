export type WorkflowManagementStatus =
  | "draft"
  | "active"
  | "paused"
  | "blocked"
  | "completed"
  | "cancelled";

export type WorkflowManagementPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type WorkflowStepStatus =
  | "pending"
  | "ready"
  | "running"
  | "blocked"
  | "completed"
  | "failed"
  | "skipped";

export type WorkflowStepType =
  | "task"
  | "operation"
  | "action"
  | "approval"
  | "validation"
  | "automation"
  | "decision";

export interface WorkflowStepDependency {
  readonly dependencyStepId: string;
  readonly requiredStatus: WorkflowStepStatus;
  readonly blocking: boolean;
}

export interface WorkflowStepDefinition {
  readonly id: string;
  readonly name: string;
  readonly type: WorkflowStepType;
  readonly ownerId?: string;
  readonly status: WorkflowStepStatus;
  readonly dependencies: readonly WorkflowStepDependency[];
  readonly estimatedEffortHours?: number;
  readonly automationEligible: boolean;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface WorkflowManagementRecord {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly description?: string;
  readonly status: WorkflowManagementStatus;
  readonly priority: WorkflowManagementPriority;
  readonly ownerId: string;
  readonly steps: readonly WorkflowStepDefinition[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly dueAt?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface WorkflowReadinessSummary {
  readonly workflowId: string;
  readonly totalSteps: number;
  readonly readySteps: number;
  readonly blockedSteps: number;
  readonly completedSteps: number;
  readonly failedSteps: number;
  readonly automationEligibleSteps: number;
  readonly readinessScore: number;
}

export interface WorkflowManagementDecision {
  readonly workflowId: string;
  readonly recommendedStatus: WorkflowManagementStatus;
  readonly readiness: WorkflowReadinessSummary;
  readonly reasons: readonly string[];
  readonly risks: readonly string[];
}