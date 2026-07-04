import {
  AIGovernanceRiskLevel,
  AIGovernanceStatus,
} from "./aiGovernanceTypes";

export interface AIGovernedModel {
  id: string;
  organizationId: string;
  name: string;
  provider: string;
  version: string;
  purpose: string;
  riskLevel: AIGovernanceRiskLevel;
  status: AIGovernanceStatus;
  ownerTeam: string;
  approvedUseCases: string[];
  restrictedUseCases: string[];
  requiresHumanOversight: boolean;
  requiresExplainability: boolean;
  requiresMonitoring: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterAIGovernedModelInput {
  id: string;
  organizationId: string;
  name: string;
  provider: string;
  version: string;
  purpose: string;
  riskLevel: AIGovernanceRiskLevel;
  ownerTeam: string;
  approvedUseCases?: string[];
  restrictedUseCases?: string[];
  requiresHumanOversight?: boolean;
  requiresExplainability?: boolean;
  requiresMonitoring?: boolean;
}

export function registerAIGovernedModel(
  input: RegisterAIGovernedModelInput,
): AIGovernedModel {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    provider: input.provider,
    version: input.version,
    purpose: input.purpose,
    riskLevel: input.riskLevel,
    status: "draft",
    ownerTeam: input.ownerTeam,
    approvedUseCases: input.approvedUseCases ?? [],
    restrictedUseCases: input.restrictedUseCases ?? [],
    requiresHumanOversight:
      input.requiresHumanOversight ??
      (
        input.riskLevel === "high" ||
        input.riskLevel === "critical"
      ),
    requiresExplainability:
      input.requiresExplainability ??
      input.riskLevel !== "low",
    requiresMonitoring:
      input.requiresMonitoring ?? true,
    createdAt: now,
    updatedAt: now,
  };
}

export function approveAIGovernedModel(
  model: AIGovernedModel,
): AIGovernedModel {
  return {
    ...model,
    status: "active",
    updatedAt: new Date(),
  };
}

export function retireAIGovernedModel(
  model: AIGovernedModel,
): AIGovernedModel {
  return {
    ...model,
    status: "retired",
    updatedAt: new Date(),
  };
}