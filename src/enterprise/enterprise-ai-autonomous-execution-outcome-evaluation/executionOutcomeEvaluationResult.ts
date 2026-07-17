import {
  ExecutionOutcomeDecision,
  ExecutionOutcomeEvaluationSeverity,
  ExecutionOutcomeEvaluationStatus,
} from "./executionOutcomeEvaluationTypes";

export interface ExecutionOutcomeEvaluationResult {
  organizationId: string;
  evaluationRequestId: string;
  executionId: string;

  outcomeScore: number;
  confidenceScore: number;

  status: ExecutionOutcomeEvaluationStatus;
  severity: ExecutionOutcomeEvaluationSeverity;
  decision: ExecutionOutcomeDecision;

  valueRealizationRate: number;
  costVarianceRate: number;
  durationVarianceRate: number;

  achievedMetrics: number;
  missedMandatoryMetrics: number;

  realizedBenefits: number;
  unrealizedStrategicBenefits: number;

  achievedObjectives: number;
  missedMandatoryObjectives: number;

  verifiedEvidence: number;
  activeMaterializedRisks: number;

  executiveClosureRequired: boolean;

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export interface CreateExecutionOutcomeEvaluationResultInput {
  organizationId: string;
  evaluationRequestId: string;
  executionId: string;

  outcomeScore: number;
  confidenceScore: number;

  status: ExecutionOutcomeEvaluationStatus;
  severity: ExecutionOutcomeEvaluationSeverity;
  decision: ExecutionOutcomeDecision;

  valueRealizationRate: number;
  costVarianceRate: number;
  durationVarianceRate: number;

  achievedMetrics: number;
  missedMandatoryMetrics: number;

  realizedBenefits: number;
  unrealizedStrategicBenefits: number;

  achievedObjectives: number;
  missedMandatoryObjectives: number;

  verifiedEvidence: number;
  activeMaterializedRisks: number;

  executiveClosureRequired: boolean;

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: string;
}

export function createExecutionOutcomeEvaluationResult(
  input: CreateExecutionOutcomeEvaluationResultInput,
): ExecutionOutcomeEvaluationResult {
  return {
    organizationId: input.organizationId,
    evaluationRequestId:
      input.evaluationRequestId,
    executionId: input.executionId,

    outcomeScore: Math.max(
      0,
      Math.min(
        100,
        Math.round(input.outcomeScore),
      ),
    ),

    confidenceScore: Math.max(
      0,
      Math.min(
        100,
        Math.round(input.confidenceScore),
      ),
    ),

    status: input.status,
    severity: input.severity,
    decision: input.decision,

    valueRealizationRate: Math.round(
      input.valueRealizationRate,
    ),

    costVarianceRate: Math.round(
      input.costVarianceRate,
    ),

    durationVarianceRate: Math.round(
      input.durationVarianceRate,
    ),

    achievedMetrics: Math.max(
      0,
      input.achievedMetrics,
    ),

    missedMandatoryMetrics: Math.max(
      0,
      input.missedMandatoryMetrics,
    ),

    realizedBenefits: Math.max(
      0,
      input.realizedBenefits,
    ),

    unrealizedStrategicBenefits: Math.max(
      0,
      input.unrealizedStrategicBenefits,
    ),

    achievedObjectives: Math.max(
      0,
      input.achievedObjectives,
    ),

    missedMandatoryObjectives: Math.max(
      0,
      input.missedMandatoryObjectives,
    ),

    verifiedEvidence: Math.max(
      0,
      input.verifiedEvidence,
    ),

    activeMaterializedRisks: Math.max(
      0,
      input.activeMaterializedRisks,
    ),

    executiveClosureRequired:
      input.executiveClosureRequired,

    executiveSummary:
      input.executiveSummary,

    recommendedAction:
      input.recommendedAction,

    evaluatedAt:
      input.evaluatedAt,
  };
}
