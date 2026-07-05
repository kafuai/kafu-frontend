import {
  calculateOperationsReadinessScore,
  determineOperationsReadinessLevel,
  type OperationsReadinessAssessment,
  type OperationsReadinessSignal,
} from "./operationsReadinessAssessment";

export interface CreateOperationsReadinessAssessmentInput {
  readonly id: string;
  readonly assessedAt: string;
  readonly assessedBy: string;
  readonly signals: readonly OperationsReadinessSignal[];
  readonly blockers?: readonly string[];
  readonly recommendations?: readonly string[];
}

export function createOperationsReadinessAssessment(
  input: CreateOperationsReadinessAssessmentInput,
): OperationsReadinessAssessment {
  const overallScore = calculateOperationsReadinessScore(input.signals);

  return {
    id: input.id,
    assessedAt: input.assessedAt,
    assessedBy: input.assessedBy,
    level: determineOperationsReadinessLevel(overallScore),
    overallScore,
    signals: input.signals,
    blockers: input.blockers ?? [],
    recommendations: input.recommendations ?? [],
  };
}