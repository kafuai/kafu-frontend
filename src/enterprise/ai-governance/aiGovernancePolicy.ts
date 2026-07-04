import {
  AIGovernancePolicy,
  AIGovernanceRiskLevel,
  AIHumanOversightLevel,
  AIUseCaseCategory,
} from "./aiGovernanceTypes";

export interface CreateAIGovernancePolicyInput {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  riskLevel: AIGovernanceRiskLevel;
  allowedUseCases?: AIUseCaseCategory[];
  restrictedUseCases?: AIUseCaseCategory[];
  humanOversightLevel?: AIHumanOversightLevel;
  requiresExplainability?: boolean;
  requiresAuditTrail?: boolean;
}

export function createAIGovernancePolicy(
  input: CreateAIGovernancePolicyInput,
): AIGovernancePolicy {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    riskLevel: input.riskLevel,
    status: "draft",
    allowedUseCases: input.allowedUseCases ?? [],
    restrictedUseCases: input.restrictedUseCases ?? [],
    humanOversightLevel: input.humanOversightLevel ?? "review_required",
    requiresExplainability: input.requiresExplainability ?? true,
    requiresAuditTrail: input.requiresAuditTrail ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

export function activateAIGovernancePolicy(
  policy: AIGovernancePolicy,
): AIGovernancePolicy {
  return {
    ...policy,
    status: "active",
    updatedAt: new Date(),
  };
}

export function suspendAIGovernancePolicy(
  policy: AIGovernancePolicy,
): AIGovernancePolicy {
  return {
    ...policy,
    status: "suspended",
    updatedAt: new Date(),
  };
}