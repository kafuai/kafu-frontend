import { AIExecutionPredictionResult } from "./aiExecutionPredictionEngine";

export interface AIExecutionPredictionReport {
  signalId: string;
  selectedScenarioId?: string;
  selectedScore?: number;
  acceptedCount: number;
  rejectedCount: number;
  successProbability?: number;
  failureProbability?: number;
  delayProbability?: number;
  riskProbability?: number;
  rationale: string;
  createdBy: string;
  createdAt: Date;
}

export function createAIExecutionPredictionReport(
  result: AIExecutionPredictionResult,
): AIExecutionPredictionReport {
  return {
    signalId: result.signal.id,
    selectedScenarioId: result.selectedScenario?.id,
    selectedScore: result.selectedScore?.total,
    acceptedCount: result.acceptedScenarios.length,
    rejectedCount: result.rejectedScenarios.length,
    successProbability: result.selectedScore?.successProbability,
    failureProbability: result.selectedScore?.failureProbability,
    delayProbability: result.selectedScore?.delayProbability,
    riskProbability: result.selectedScore?.riskProbability,
    rationale: result.rationale,
    createdBy: result.metadata.createdBy,
    createdAt: result.metadata.createdAt,
  };
}