import {
  AIAutonomousEvolutionPriority,
  AIAutonomousEvolutionRiskLevel,
  AIAutonomousEvolutionScope,
} from "./aiAutonomousEvolutionTypes";

export interface AIAutonomousEvolutionPolicy {
  id: string;
  organizationId: string;
  name: string;
  allowedScopes: AIAutonomousEvolutionScope[];
  blockedScopes: AIAutonomousEvolutionScope[];
  minimumSignalConfidence: number;
  minimumRequiredSignals: number;
  maxAllowedRiskLevel: AIAutonomousEvolutionRiskLevel;
  requiresHumanApprovalAboveRisk: AIAutonomousEvolutionRiskLevel;
  autoApprovePriorities: AIAutonomousEvolutionPriority[];
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAutonomousEvolutionPolicyInput {
  id: string;
  organizationId: string;
  name: string;
  allowedScopes?: AIAutonomousEvolutionScope[];
  blockedScopes?: AIAutonomousEvolutionScope[];
  minimumSignalConfidence?: number;
  minimumRequiredSignals?: number;
  maxAllowedRiskLevel?: AIAutonomousEvolutionRiskLevel;
  requiresHumanApprovalAboveRisk?: AIAutonomousEvolutionRiskLevel;
  autoApprovePriorities?: AIAutonomousEvolutionPriority[];
  isEnabled?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export function createAIAutonomousEvolutionPolicy(
  input: CreateAIAutonomousEvolutionPolicyInput,
): AIAutonomousEvolutionPolicy {
  const createdAt = input.createdAt ?? new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    allowedScopes:
      input.allowedScopes ?? [
        "capability",
        "workflow",
        "agent_behavior",
        "runtime_strategy",
        "knowledge_model",
      ],
    blockedScopes: input.blockedScopes ?? [],
    minimumSignalConfidence: input.minimumSignalConfidence ?? 0.7,
    minimumRequiredSignals: input.minimumRequiredSignals ?? 1,
    maxAllowedRiskLevel: input.maxAllowedRiskLevel ?? "high",
    requiresHumanApprovalAboveRisk: input.requiresHumanApprovalAboveRisk ?? "medium",
    autoApprovePriorities: input.autoApprovePriorities ?? ["low", "medium"],
    isEnabled: input.isEnabled ?? true,
    createdAt,
    updatedAt: input.updatedAt ?? createdAt,
  };
}