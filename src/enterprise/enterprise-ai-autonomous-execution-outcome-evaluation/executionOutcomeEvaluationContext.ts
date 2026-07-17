import {
  ExecutionOutcomeBenefit,
  ExecutionOutcomeEvidence,
  ExecutionOutcomeMetric,
  ExecutionOutcomeObjective,
  ExecutionOutcomeRisk,
} from "./executionOutcomeEvaluationTypes";

export interface ExecutionOutcomeEvaluationContext {
  organizationId: string;
  evaluationRequestId: string;
  executionId: string;
  executionTitle: string;

  executionStartedAt: string;
  executionCompletedAt?: string | null;

  expectedDurationDays: number;
  actualDurationDays: number;

  expectedCost: number;
  actualCost: number;

  expectedValue: number;
  realizedValue: number;

  strategicAlignmentScore: number;
  stakeholderSatisfactionScore: number;
  deliveryQualityScore: number;
  operationalImpactScore: number;
  sustainabilityScore: number;

  metrics: ExecutionOutcomeMetric[];
  benefits: ExecutionOutcomeBenefit[];
  objectives: ExecutionOutcomeObjective[];
  evidence: ExecutionOutcomeEvidence[];
  risks: ExecutionOutcomeRisk[];

  allowExtension: boolean;
  allowCorrectiveAction: boolean;
  requireExecutiveClosure: boolean;

  evaluatedAt: string;
}

export interface CreateExecutionOutcomeEvaluationContextInput {
  organizationId: string;
  evaluationRequestId: string;
  executionId: string;
  executionTitle: string;

  executionStartedAt?: string;
  executionCompletedAt?: string | null;

  expectedDurationDays?: number;
  actualDurationDays?: number;

  expectedCost?: number;
  actualCost?: number;

  expectedValue?: number;
  realizedValue?: number;

  strategicAlignmentScore?: number;
  stakeholderSatisfactionScore?: number;
  deliveryQualityScore?: number;
  operationalImpactScore?: number;
  sustainabilityScore?: number;

  metrics?: ExecutionOutcomeMetric[];
  benefits?: ExecutionOutcomeBenefit[];
  objectives?: ExecutionOutcomeObjective[];
  evidence?: ExecutionOutcomeEvidence[];
  risks?: ExecutionOutcomeRisk[];

  allowExtension?: boolean;
  allowCorrectiveAction?: boolean;
  requireExecutiveClosure?: boolean;

  evaluatedAt?: string;
}

function normalizeScore(
  value: number | undefined,
  fallback: number,
): number {
  const normalized = value ?? fallback;

  return Math.max(
    0,
    Math.min(100, Math.round(normalized)),
  );
}

function normalizePositiveNumber(
  value: number | undefined,
  fallback: number,
): number {
  return Math.max(0, value ?? fallback);
}

export function createExecutionOutcomeEvaluationContext(
  input: CreateExecutionOutcomeEvaluationContextInput,
): ExecutionOutcomeEvaluationContext {
  const evaluatedAt =
    input.evaluatedAt ?? new Date().toISOString();

  return {
    organizationId: input.organizationId,
    evaluationRequestId:
      input.evaluationRequestId,
    executionId: input.executionId,
    executionTitle: input.executionTitle,

    executionStartedAt:
      input.executionStartedAt ?? evaluatedAt,

    executionCompletedAt:
      input.executionCompletedAt ?? null,

    expectedDurationDays:
      normalizePositiveNumber(
        input.expectedDurationDays,
        0,
      ),

    actualDurationDays:
      normalizePositiveNumber(
        input.actualDurationDays,
        0,
      ),

    expectedCost:
      normalizePositiveNumber(
        input.expectedCost,
        0,
      ),

    actualCost:
      normalizePositiveNumber(
        input.actualCost,
        0,
      ),

    expectedValue:
      normalizePositiveNumber(
        input.expectedValue,
        0,
      ),

    realizedValue:
      normalizePositiveNumber(
        input.realizedValue,
        0,
      ),

    strategicAlignmentScore:
      normalizeScore(
        input.strategicAlignmentScore,
        75,
      ),

    stakeholderSatisfactionScore:
      normalizeScore(
        input.stakeholderSatisfactionScore,
        75,
      ),

    deliveryQualityScore:
      normalizeScore(
        input.deliveryQualityScore,
        75,
      ),

    operationalImpactScore:
      normalizeScore(
        input.operationalImpactScore,
        75,
      ),

    sustainabilityScore:
      normalizeScore(
        input.sustainabilityScore,
        75,
      ),

    metrics: input.metrics ?? [],
    benefits: input.benefits ?? [],
    objectives: input.objectives ?? [],
    evidence: input.evidence ?? [],
    risks: input.risks ?? [],

    allowExtension:
      input.allowExtension ?? true,

    allowCorrectiveAction:
      input.allowCorrectiveAction ?? true,

    requireExecutiveClosure:
      input.requireExecutiveClosure ?? false,

    evaluatedAt,
  };
}
