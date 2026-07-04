import { AIGovernanceRiskLevel } from "./aiGovernanceTypes";

export type AIExplainabilityLevel =
  | "none"
  | "basic"
  | "decision_factors"
  | "full_trace";

export interface AIExplainabilityRequirement {
  id: string;
  organizationId: string;
  useCaseId: string;
  riskLevel: AIGovernanceRiskLevel;
  requiredLevel: AIExplainabilityLevel;
  requiredArtifacts: string[];
  createdAt: Date;
}

export function determineExplainabilityLevel(
  riskLevel: AIGovernanceRiskLevel,
): AIExplainabilityLevel {
  if (riskLevel === "critical") {
    return "full_trace";
  }

  if (riskLevel === "high") {
    return "decision_factors";
  }

  if (riskLevel === "medium") {
    return "basic";
  }

  return "none";
}

export interface CreateAIExplainabilityRequirementInput {
  id: string;
  organizationId: string;
  useCaseId: string;
  riskLevel: AIGovernanceRiskLevel;
  requiredArtifacts?: string[];
}

export function createAIExplainabilityRequirement(
  input: CreateAIExplainabilityRequirementInput,
): AIExplainabilityRequirement {
  const requiredLevel = determineExplainabilityLevel(input.riskLevel);

  return {
    id: input.id,
    organizationId: input.organizationId,
    useCaseId: input.useCaseId,
    riskLevel: input.riskLevel,
    requiredLevel,
    requiredArtifacts:
      input.requiredArtifacts ??
      (requiredLevel === "none"
        ? []
        : ["decision rationale", "input factors", "model limitations"]),
    createdAt: new Date(),
  };
}