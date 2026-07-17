import { StrategicAlignmentContext } from "./strategicAlignmentContext";
import { StrategicAlignmentDimensionScore } from "./strategicAlignmentTypes";

export interface StrategicAlignmentScoreCalculation {
  alignmentScore: number;
  dimensionScores: StrategicAlignmentDimensionScore[];
}

function normalizeScore(score: number): number {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateReferenceScore(referenceCount: number): number {
  if (referenceCount >= 3) {
    return 100;
  }

  if (referenceCount === 2) {
    return 80;
  }

  if (referenceCount === 1) {
    return 60;
  }

  return 20;
}

function createDimensionScore(
  dimension: StrategicAlignmentDimensionScore["dimension"],
  score: number,
  weight: number,
  rationale: string,
): StrategicAlignmentDimensionScore {
  const normalizedScore = normalizeScore(score);

  return {
    dimension,
    score: normalizedScore,
    weight,
    weightedScore: Math.round(normalizedScore * weight),
    rationale,
  };
}

export function calculateStrategicAlignmentScore(
  context: StrategicAlignmentContext,
): StrategicAlignmentScoreCalculation {
  const strategicObjectiveScore = calculateReferenceScore(
    context.strategicObjectiveIds.length,
  );

  const enterprisePriorityScore = calculateReferenceScore(
    context.enterprisePriorityIds.length,
  );

  const portfolioAndInitiativeReferences =
    context.portfolioIds.length + context.initiativeIds.length;

  const portfolioAlignmentScore = calculateReferenceScore(
    context.portfolioIds.length,
  );

  const initiativeAlignmentScore = calculateReferenceScore(
    context.initiativeIds.length,
  );

  const riskConstraintScore = normalizeScore(
    100 -
      context.riskExposureScore -
      context.blockingConstraintIds.length * 15 -
      context.conflictingDecisionIds.length * 10,
  );

  const executionReadinessScore = normalizeScore(
    context.executionReadinessScore * 0.6 +
      context.resourceAvailabilityScore * 0.25 +
      context.expectedValueScore * 0.15,
  );

  const dimensionScores: StrategicAlignmentDimensionScore[] = [
    createDimensionScore(
      "strategic_objectives",
      strategicObjectiveScore,
      0.2,
      context.strategicObjectiveIds.length > 0
        ? `Decision is connected to ${context.strategicObjectiveIds.length} strategic objective(s).`
        : "Decision has no explicit strategic objective connection.",
    ),
    createDimensionScore(
      "enterprise_priorities",
      enterprisePriorityScore,
      0.2,
      context.enterprisePriorityIds.length > 0
        ? `Decision supports ${context.enterprisePriorityIds.length} enterprise priority reference(s).`
        : "Decision has no explicit enterprise priority connection.",
    ),
    createDimensionScore(
      "portfolio_alignment",
      portfolioAlignmentScore,
      0.15,
      context.portfolioIds.length > 0
        ? `Decision is associated with ${context.portfolioIds.length} portfolio reference(s).`
        : "Decision is not associated with an enterprise portfolio.",
    ),
    createDimensionScore(
      "initiative_alignment",
      initiativeAlignmentScore,
      0.15,
      context.initiativeIds.length > 0
        ? `Decision supports ${context.initiativeIds.length} enterprise initiative(s).`
        : portfolioAndInitiativeReferences > 0
          ? "Decision has portfolio context but no direct initiative alignment."
          : "Decision has no portfolio or initiative alignment context.",
    ),
    createDimensionScore(
      "risk_constraints",
      riskConstraintScore,
      0.15,
      context.blockingConstraintIds.length > 0
        ? `Decision has ${context.blockingConstraintIds.length} blocking constraint(s).`
        : context.conflictingDecisionIds.length > 0
          ? `Decision has ${context.conflictingDecisionIds.length} conflicting decision(s).`
          : "No blocking constraints or decision conflicts were identified.",
    ),
    createDimensionScore(
      "execution_readiness",
      executionReadinessScore,
      0.15,
      `Execution readiness is ${context.executionReadinessScore}% with ${context.resourceAvailabilityScore}% resource availability.`,
    ),
  ];

  const alignmentScore = normalizeScore(
    dimensionScores.reduce(
      (total, dimension) => total + dimension.weightedScore,
      0,
    ),
  );

  return {
    alignmentScore,
    dimensionScores,
  };
}
