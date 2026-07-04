import { AIDecisionEngineResult } from "./aiDecisionEngine";

export interface AIDecisionReport {
  contextId: string;
  organizationId: string;
  objective: string;
  selectedOptionId?: string;
  outcome: string;
  confidenceScore?: number;
  riskScore?: number;
  summary: string;
  generatedAt: Date;
}

export function createAIDecisionReport(
  result: AIDecisionEngineResult,
): AIDecisionReport {
  const selectedOptionId = result.selection.selectedOption?.id;

  const confidence = result.confidenceAssessments.find(
    (item) => item.optionId === selectedOptionId,
  );

  const risk = result.riskAssessments.find(
    (item) => item.optionId === selectedOptionId,
  );

  return {
    contextId: result.context.id,
    organizationId: result.context.organizationId,
    objective: result.context.objective,
    selectedOptionId,
    outcome: result.outcome.outcome,
    confidenceScore: confidence?.confidenceScore,
    riskScore: risk?.riskScore,
    summary: result.recommendation.summary,
    generatedAt: new Date(),
  };
}