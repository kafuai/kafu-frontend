import { ExecutionOutcomeEvaluationContext } from "./executionOutcomeEvaluationContext";

export interface ExecutionOutcomeEvaluationScoreCalculation {
  outcomeScore: number;
  confidenceScore: number;
  valueRealizationRate: number;
  costVarianceRate: number;
  durationVarianceRate: number;

  strategicContribution: number;
  stakeholderContribution: number;
  qualityContribution: number;
  operationalContribution: number;
  sustainabilityContribution: number;
}

function percentage(actual: number, target: number): number {
  if (target <= 0) {
    return 100;
  }

  return Math.round((actual / target) * 100);
}

export function calculateExecutionOutcomeEvaluationScore(
  context: ExecutionOutcomeEvaluationContext,
): ExecutionOutcomeEvaluationScoreCalculation {
  const valueRealizationRate = percentage(
    context.realizedValue,
    context.expectedValue,
  );

  const costVarianceRate =
    context.expectedCost <= 0
      ? 0
      : Math.round(
          ((context.actualCost - context.expectedCost) /
            context.expectedCost) *
            100,
        );

  const durationVarianceRate =
    context.expectedDurationDays <= 0
      ? 0
      : Math.round(
          ((context.actualDurationDays -
            context.expectedDurationDays) /
            context.expectedDurationDays) *
            100,
        );

  const strategicContribution =
    context.strategicAlignmentScore * 0.25;

  const stakeholderContribution =
    context.stakeholderSatisfactionScore * 0.20;

  const qualityContribution =
    context.deliveryQualityScore * 0.20;

  const operationalContribution =
    context.operationalImpactScore * 0.20;

  const sustainabilityContribution =
    context.sustainabilityScore * 0.15;

  let outcomeScore =
    strategicContribution +
    stakeholderContribution +
    qualityContribution +
    operationalContribution +
    sustainabilityContribution;

  if (valueRealizationRate < 100) {
    outcomeScore -= Math.min(
      20,
      (100 - valueRealizationRate) * 0.2,
    );
  }

  if (costVarianceRate > 0) {
    outcomeScore -= Math.min(
      15,
      costVarianceRate * 0.3,
    );
  }

  if (durationVarianceRate > 0) {
    outcomeScore -= Math.min(
      15,
      durationVarianceRate * 0.3,
    );
  }

  const confidenceScore = Math.round(
    (
      context.strategicAlignmentScore +
      context.stakeholderSatisfactionScore +
      context.deliveryQualityScore +
      context.operationalImpactScore +
      context.sustainabilityScore
    ) / 5,
  );

  return {
    outcomeScore: Math.max(
      0,
      Math.min(100, Math.round(outcomeScore)),
    ),
    confidenceScore,

    valueRealizationRate,
    costVarianceRate,
    durationVarianceRate,

    strategicContribution: Math.round(
      strategicContribution,
    ),
    stakeholderContribution: Math.round(
      stakeholderContribution,
    ),
    qualityContribution: Math.round(
      qualityContribution,
    ),
    operationalContribution: Math.round(
      operationalContribution,
    ),
    sustainabilityContribution: Math.round(
      sustainabilityContribution,
    ),
  };
}
