import { AIGovernanceRiskLevel } from "./aiGovernanceTypes";

export type AIGovernanceDecisionOutcome =
  | "approved"
  | "approved_with_conditions"
  | "rejected"
  | "requires_review";

export interface AIGovernanceDecision {
  id: string;
  organizationId: string;
  useCaseId: string;
  policyId?: string;
  outcome: AIGovernanceDecisionOutcome;
  riskLevel: AIGovernanceRiskLevel;
  reasons: string[];
  conditions: string[];
  decidedBy: string;
  decidedAt: Date;
}

export interface CreateAIGovernanceDecisionInput {
  id: string;
  organizationId: string;
  useCaseId: string;
  policyId?: string;
  outcome: AIGovernanceDecisionOutcome;
  riskLevel: AIGovernanceRiskLevel;
  reasons?: string[];
  conditions?: string[];
  decidedBy: string;
}

export function createAIGovernanceDecision(
  input: CreateAIGovernanceDecisionInput,
): AIGovernanceDecision {
  return {
    id: input.id,
    organizationId: input.organizationId,
    useCaseId: input.useCaseId,
    policyId: input.policyId,
    outcome: input.outcome,
    riskLevel: input.riskLevel,
    reasons: input.reasons ?? [],
    conditions: input.conditions ?? [],
    decidedBy: input.decidedBy,
    decidedAt: new Date(),
  };
}