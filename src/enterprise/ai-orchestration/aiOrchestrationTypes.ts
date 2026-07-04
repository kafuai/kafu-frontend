export type AIOrchestrationPriority = "low" | "normal" | "high" | "critical";

export type AIOrchestrationStatus =
  | "draft"
  | "active"
  | "paused"
  | "deprecated"
  | "archived";

export type AIOrchestrationStepType =
  | "model"
  | "tool"
  | "policy"
  | "evaluation"
  | "optimization"
  | "human_review"
  | "decision"
  | "notification";

export type AIOrchestrationStepStatus =
  | "pending"
  | "ready"
  | "running"
  | "completed"
  | "failed"
  | "skipped"
  | "blocked";

export type AIOrchestrationExecutionStatus =
  | "queued"
  | "planning"
  | "running"
  | "completed"
  | "failed"
  | "cancelled"
  | "requires_review";

export interface AIOrchestrationMetadata {
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  ownerTeam: string;
  tags: string[];
}

export interface AIOrchestrationGuardrail {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enforcementMode: "advisory" | "blocking";
}

export interface AIOrchestrationStepDependency {
  stepId: string;
  condition?: string;
  required: boolean;
}

export interface AIOrchestrationStep {
  id: string;
  workflowId: string;
  name: string;
  description: string;
  type: AIOrchestrationStepType;
  capability: string;
  dependencies: AIOrchestrationStepDependency[];
  guardrails: AIOrchestrationGuardrail[];
  timeoutMs?: number;
  retryLimit?: number;
  requiredHumanApproval: boolean;
  priority: AIOrchestrationPriority;
}

export interface AIOrchestrationWorkflow {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  status: AIOrchestrationStatus;
  priority: AIOrchestrationPriority;
  version: string;
  objective: string;
  steps: AIOrchestrationStep[];
  metadata: AIOrchestrationMetadata;
}