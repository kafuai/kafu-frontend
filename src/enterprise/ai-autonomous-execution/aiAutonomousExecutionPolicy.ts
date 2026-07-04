import {
  AIAutonomousExecutionApprovalMode,
  AIAutonomousExecutionPriority,
  AIAutonomousExecutionRiskLevel,
} from "./aiAutonomousExecutionTypes";

export interface AIAutonomousExecutionPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  allowedCapabilityIds: string[];
  blockedCapabilityIds: string[];
  maxRiskLevel: AIAutonomousExecutionRiskLevel;
  approvalRequiredRiskLevels: AIAutonomousExecutionRiskLevel[];
  approvalRequiredPriorities: AIAutonomousExecutionPriority[];
  defaultApprovalMode: AIAutonomousExecutionApprovalMode;
  allowCrossAgentExecution: boolean;
  allowExternalActions: boolean;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAutonomousExecutionPolicyInput {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  allowedCapabilityIds?: string[];
  blockedCapabilityIds?: string[];
  maxRiskLevel?: AIAutonomousExecutionRiskLevel;
  approvalRequiredRiskLevels?: AIAutonomousExecutionRiskLevel[];
  approvalRequiredPriorities?: AIAutonomousExecutionPriority[];
  defaultApprovalMode?: AIAutonomousExecutionApprovalMode;
  allowCrossAgentExecution?: boolean;
  allowExternalActions?: boolean;
  enabled?: boolean;
  createdAt?: Date;
}

export function createAIAutonomousExecutionPolicy(
  input: CreateAIAutonomousExecutionPolicyInput,
): AIAutonomousExecutionPolicy {
  const now = input.createdAt ?? new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    allowedCapabilityIds: input.allowedCapabilityIds ?? [],
    blockedCapabilityIds: input.blockedCapabilityIds ?? [],
    maxRiskLevel: input.maxRiskLevel ?? "high",
    approvalRequiredRiskLevels: input.approvalRequiredRiskLevels ?? ["high", "critical"],
    approvalRequiredPriorities: input.approvalRequiredPriorities ?? ["critical"],
    defaultApprovalMode: input.defaultApprovalMode ?? "policy_required",
    allowCrossAgentExecution: input.allowCrossAgentExecution ?? true,
    allowExternalActions: input.allowExternalActions ?? false,
    enabled: input.enabled ?? true,
    createdAt: now,
    updatedAt: now,
  };
}