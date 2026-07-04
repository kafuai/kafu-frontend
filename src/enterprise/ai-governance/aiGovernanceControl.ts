import { AIGovernanceRiskLevel } from "./aiGovernanceTypes";

export type AIGovernanceControlType =
  | "preventive"
  | "detective"
  | "corrective";

export interface AIGovernanceControl {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  type: AIGovernanceControlType;
  riskLevel: AIGovernanceRiskLevel;
  enabled: boolean;
  evidenceRequired: boolean;
}

export function createAIGovernanceControl(input: {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  type: AIGovernanceControlType;
  riskLevel: AIGovernanceRiskLevel;
  enabled?: boolean;
  evidenceRequired?: boolean;
}): AIGovernanceControl {
  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    type: input.type,
    riskLevel: input.riskLevel,
    enabled: input.enabled ?? true,
    evidenceRequired: input.evidenceRequired ?? input.riskLevel !== "low",
  };
}