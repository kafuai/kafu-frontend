import { AIAccountabilitySeverity } from "./aiAccountabilityTypes";

export interface AIDecisionJustification {
  id: string;
  organizationId: string;
  decisionId: string;
  summary: string;
  reasoning: string;
  policyReferences: string[];
  dataReferences: string[];
  limitations: string[];
  confidenceScore: number;
  residualRiskLevel: AIAccountabilitySeverity;
  createdBy: string;
  createdAt: Date;
}

export interface CreateAIDecisionJustificationInput {
  id: string;
  organizationId: string;
  decisionId: string;
  summary: string;
  reasoning: string;
  policyReferences?: string[];
  dataReferences?: string[];
  limitations?: string[];
  confidenceScore: number;
  residualRiskLevel: AIAccountabilitySeverity;
  createdBy: string;
}

export function createAIDecisionJustification(
  input: CreateAIDecisionJustificationInput,
  now: Date = new Date(),
): AIDecisionJustification {
  return {
    id: input.id,
    organizationId: input.organizationId,
    decisionId: input.decisionId,
    summary: input.summary,
    reasoning: input.reasoning,
    policyReferences: input.policyReferences ?? [],
    dataReferences: input.dataReferences ?? [],
    limitations: input.limitations ?? [],
    confidenceScore: Math.max(0, Math.min(1, input.confidenceScore)),
    residualRiskLevel: input.residualRiskLevel,
    createdBy: input.createdBy,
    createdAt: now,
  };
}

export function isDecisionJustificationComplete(
  justification: AIDecisionJustification,
): boolean {
  return (
    justification.summary.trim().length > 0 &&
    justification.reasoning.trim().length > 0 &&
    justification.policyReferences.length > 0 &&
    justification.confidenceScore >= 0 &&
    justification.confidenceScore <= 1
  );
}