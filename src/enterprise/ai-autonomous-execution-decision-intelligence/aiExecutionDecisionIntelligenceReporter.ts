import { AIExecutionDecisionIntelligenceResult } from "./aiExecutionDecisionIntelligenceEngine";

export interface AIExecutionDecisionIntelligenceReport {
  signalId: string;
  selectedOptionId?: string;
  selectedScore?: number;
  acceptedCount: number;
  rejectedCount: number;
  rationale: string;
  createdBy: string;
  createdAt: Date;
}

export function createAIExecutionDecisionIntelligenceReport(
  result: AIExecutionDecisionIntelligenceResult,
): AIExecutionDecisionIntelligenceReport {
  return {
    signalId: result.signal.id,
    selectedOptionId: result.selectedOption?.id,
    selectedScore: result.selectedScore?.total,
    acceptedCount: result.acceptedOptions.length,
    rejectedCount: result.rejectedOptions.length,
    rationale: result.rationale,
    createdBy: result.metadata.createdBy,
    createdAt: result.metadata.createdAt,
  };
}