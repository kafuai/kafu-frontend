export interface StrategicAlignmentContext {
  organizationId: string;
  decisionId: string;
  decisionTitle: string;
  decisionSummary: string;

  strategicObjectiveIds: string[];
  enterprisePriorityIds: string[];
  portfolioIds: string[];
  initiativeIds: string[];

  expectedValueScore: number;
  executionReadinessScore: number;
  riskExposureScore: number;
  resourceAvailabilityScore: number;

  conflictingDecisionIds: string[];
  blockingConstraintIds: string[];

  evaluatedAt: Date;
}

export interface CreateStrategicAlignmentContextInput {
  organizationId: string;
  decisionId: string;
  decisionTitle: string;
  decisionSummary: string;

  strategicObjectiveIds?: string[];
  enterprisePriorityIds?: string[];
  portfolioIds?: string[];
  initiativeIds?: string[];

  expectedValueScore?: number;
  executionReadinessScore?: number;
  riskExposureScore?: number;
  resourceAvailabilityScore?: number;

  conflictingDecisionIds?: string[];
  blockingConstraintIds?: string[];

  evaluatedAt?: Date;
}

function normalizeScore(score: number | undefined): number {
  if (score === undefined || Number.isNaN(score)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}

export function createStrategicAlignmentContext(
  input: CreateStrategicAlignmentContextInput,
): StrategicAlignmentContext {
  return {
    organizationId: input.organizationId,
    decisionId: input.decisionId,
    decisionTitle: input.decisionTitle,
    decisionSummary: input.decisionSummary,

    strategicObjectiveIds: input.strategicObjectiveIds ?? [],
    enterprisePriorityIds: input.enterprisePriorityIds ?? [],
    portfolioIds: input.portfolioIds ?? [],
    initiativeIds: input.initiativeIds ?? [],

    expectedValueScore: normalizeScore(input.expectedValueScore),
    executionReadinessScore: normalizeScore(
      input.executionReadinessScore,
    ),
    riskExposureScore: normalizeScore(input.riskExposureScore),
    resourceAvailabilityScore: normalizeScore(
      input.resourceAvailabilityScore,
    ),

    conflictingDecisionIds: input.conflictingDecisionIds ?? [],
    blockingConstraintIds: input.blockingConstraintIds ?? [],

    evaluatedAt: input.evaluatedAt ?? new Date(),
  };
}
