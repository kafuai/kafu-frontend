export type AIAgentGoalStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "blocked"
  | "cancelled";

export type AIAgentTaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type AIAgentTaskStatus =
  | "queued"
  | "assigned"
  | "running"
  | "waiting"
  | "completed"
  | "failed"
  | "cancelled";

export type AIAgentPlanStatus =
  | "draft"
  | "approved"
  | "executing"
  | "completed"
  | "failed"
  | "cancelled";

export interface AIAgentGoal {
  id: string;
  agentId: string;
  organizationId: string;
  title: string;
  description: string;
  status: AIAgentGoalStatus;
  successCriteria: string[];
  constraints: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAgentTask {
  id: string;
  goalId: string;
  agentId: string;
  organizationId: string;
  title: string;
  description: string;
  priority: AIAgentTaskPriority;
  status: AIAgentTaskStatus;
  requiredCapabilities: string[];
  dependencies: string[];
  expectedOutcome: string;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAgentPlanStep {
  id: string;
  taskId: string;
  title: string;
  description: string;
  order: number;
  requiredCapabilityIds: string[];
  requiresApproval: boolean;
  completed: boolean;
}

export interface AIAgentPlan {
  id: string;
  goalId: string;
  agentId: string;
  organizationId: string;
  status: AIAgentPlanStatus;
  steps: AIAgentPlanStep[];
  riskNotes: string[];
  approvalRequired: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAgentGoalInput {
  id: string;
  agentId: string;
  organizationId: string;
  title: string;
  description: string;
  successCriteria?: string[];
  constraints?: string[];
}

export interface CreateAIAgentTaskInput {
  id: string;
  goalId: string;
  agentId: string;
  organizationId: string;
  title: string;
  description: string;
  priority: AIAgentTaskPriority;
  requiredCapabilities?: string[];
  dependencies?: string[];
  expectedOutcome: string;
}

export interface CreateAIAgentPlanInput {
  id: string;
  goalId: string;
  agentId: string;
  organizationId: string;
  steps: AIAgentPlanStep[];
  riskNotes?: string[];
  approvalRequired?: boolean;
}