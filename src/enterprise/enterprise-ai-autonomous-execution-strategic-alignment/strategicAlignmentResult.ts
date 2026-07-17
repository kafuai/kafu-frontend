import {
  StrategicAlignmentDimensionScore,
  StrategicAlignmentLevel,
  StrategicAlignmentStatus,
} from "./strategicAlignmentTypes";

export interface StrategicAlignmentResult {
  organizationId: string;
  decisionId: string;

  alignmentScore: number;
  status: StrategicAlignmentStatus;
  attentionLevel: StrategicAlignmentLevel;

  dimensionScores: StrategicAlignmentDimensionScore[];

  alignedObjectiveIds: string[];
  alignedPriorityIds: string[];
  alignedPortfolioIds: string[];
  alignedInitiativeIds: string[];

  conflicts: string[];
  blockingConstraints: string[];

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt: Date;
}

export interface CreateStrategicAlignmentResultInput {
  organizationId: string;
  decisionId: string;

  alignmentScore: number;
  status: StrategicAlignmentStatus;
  attentionLevel: StrategicAlignmentLevel;

  dimensionScores?: StrategicAlignmentDimensionScore[];

  alignedObjectiveIds?: string[];
  alignedPriorityIds?: string[];
  alignedPortfolioIds?: string[];
  alignedInitiativeIds?: string[];

  conflicts?: string[];
  blockingConstraints?: string[];

  executiveSummary: string;
  recommendedAction: string;

  evaluatedAt?: Date;
}

export function createStrategicAlignmentResult(
  input: CreateStrategicAlignmentResultInput,
): StrategicAlignmentResult {
  return {
    organizationId: input.organizationId,
    decisionId: input.decisionId,

    alignmentScore: Math.max(
      0,
      Math.min(100, Math.round(input.alignmentScore)),
    ),
    status: input.status,
    attentionLevel: input.attentionLevel,

    dimensionScores: input.dimensionScores ?? [],

    alignedObjectiveIds: input.alignedObjectiveIds ?? [],
    alignedPriorityIds: input.alignedPriorityIds ?? [],
    alignedPortfolioIds: input.alignedPortfolioIds ?? [],
    alignedInitiativeIds: input.alignedInitiativeIds ?? [],

    conflicts: input.conflicts ?? [],
    blockingConstraints: input.blockingConstraints ?? [],

    executiveSummary: input.executiveSummary,
    recommendedAction: input.recommendedAction,

    evaluatedAt: input.evaluatedAt ?? new Date(),
  };
}
