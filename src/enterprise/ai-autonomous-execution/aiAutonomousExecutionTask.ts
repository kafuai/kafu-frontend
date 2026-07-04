import {
  AIAutonomousExecutionApprovalMode,
  AIAutonomousExecutionPriority,
  AIAutonomousExecutionRiskLevel,
  AIAutonomousExecutionTaskStatus,
} from "./aiAutonomousExecutionTypes";

export interface AIAutonomousExecutionTask {
  id: string;
  organizationId: string;
  planId: string;
  title: string;
  description: string;
  capabilityId: string;
  requestedByAgentId: string;
  assignedAgentId?: string;
  priority: AIAutonomousExecutionPriority;
  riskLevel: AIAutonomousExecutionRiskLevel;
  approvalMode: AIAutonomousExecutionApprovalMode;
  status: AIAutonomousExecutionTaskStatus;
  dependencies: string[];
  requiredInputs: string[];
  expectedOutputs: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAutonomousExecutionTaskInput {
  id: string;
  organizationId: string;
  planId: string;
  title: string;
  description: string;
  capabilityId: string;
  requestedByAgentId: string;
  assignedAgentId?: string;
  priority?: AIAutonomousExecutionPriority;
  riskLevel?: AIAutonomousExecutionRiskLevel;
  approvalMode?: AIAutonomousExecutionApprovalMode;
  dependencies?: string[];
  requiredInputs?: string[];
  expectedOutputs?: string[];
  createdAt?: Date;
}

export function createAIAutonomousExecutionTask(
  input: CreateAIAutonomousExecutionTaskInput,
): AIAutonomousExecutionTask {
  const now = input.createdAt ?? new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    planId: input.planId,
    title: input.title,
    description: input.description,
    capabilityId: input.capabilityId,
    requestedByAgentId: input.requestedByAgentId,
    assignedAgentId: input.assignedAgentId,
    priority: input.priority ?? "medium",
    riskLevel: input.riskLevel ?? "medium",
    approvalMode: input.approvalMode ?? "policy_required",
    status: "pending",
    dependencies: input.dependencies ?? [],
    requiredInputs: input.requiredInputs ?? [],
    expectedOutputs: input.expectedOutputs ?? [],
    createdAt: now,
    updatedAt: now,
  };
}

export function markAIAutonomousExecutionTaskStatus(
  task: AIAutonomousExecutionTask,
  status: AIAutonomousExecutionTaskStatus,
): AIAutonomousExecutionTask {
  return {
    ...task,
    status,
    updatedAt: new Date(),
  };
}