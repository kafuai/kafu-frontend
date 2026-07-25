import type {
  RevenuePredictionConfidence,
  RevenuePredictionContext,
  RevenuePredictionOpportunityInput,
  RevenuePredictionRiskLevel,
  RevenuePredictionScenario,
  RevenuePredictionTrend,
} from "./RevenuePredictionTypes";

export interface RevenuePredictionModelInput {
  context: RevenuePredictionContext;
  opportunity:
    RevenuePredictionOpportunityInput;
  generatedAt: Date;
}

export interface RevenuePredictionModelResult {
  probability: number;

  riskAdjustment: number;
  timingAdjustment: number;
  activityAdjustment: number;
  momentumAdjustment: number;

  conservativeMultiplier: number;
  baseMultiplier: number;
  optimisticMultiplier: number;
}

export interface RevenuePredictionProbabilityModel {
  calculate(
    input: RevenuePredictionModelInput,
  ): RevenuePredictionModelResult;
}

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number =>
  Math.min(
    maximum,
    Math.max(minimum, value),
  );

const normalizePercentage = (
  value: number | undefined,
  fallback: number,
): number => {
  if (
    value === undefined
    || !Number.isFinite(value)
  ) {
    return fallback;
  }

  return clamp(value, 0, 100);
};

const resolveBaseProbability = (
  opportunity:
    RevenuePredictionOpportunityInput,
): number => {
  if (
    opportunity.winProbability
    !== undefined
  ) {
    return normalizePercentage(
      opportunity.winProbability,
      50,
    );
  }

  if (
    opportunity.stageProbability
    !== undefined
  ) {
    return normalizePercentage(
      opportunity.stageProbability,
      50,
    );
  }

  if (
    opportunity.historicalWinRate
    !== undefined
  ) {
    return normalizePercentage(
      opportunity.historicalWinRate,
      50,
    );
  }

  return 50;
};

const calculateRiskAdjustment = (
  opportunity:
    RevenuePredictionOpportunityInput,
): number => {
  const riskScore = normalizePercentage(
    opportunity.riskScore,
    30,
  );

  if (riskScore >= 80) {
    return -0.3;
  }

  if (riskScore >= 60) {
    return -0.2;
  }

  if (riskScore >= 40) {
    return -0.1;
  }

  if (riskScore <= 15) {
    return 0.05;
  }

  return 0;
};

const calculateTimingAdjustment = (
  opportunity:
    RevenuePredictionOpportunityInput,
  periodStart: Date,
  periodEnd: Date,
): number => {
  if (!opportunity.expectedCloseDate) {
    return -0.15;
  }

  const closeDate = new Date(
    opportunity.expectedCloseDate,
  );

  if (
    Number.isNaN(closeDate.getTime())
  ) {
    return -0.15;
  }

  if (closeDate < periodStart) {
    return -0.2;
  }

  if (closeDate > periodEnd) {
    return -0.35;
  }

  const periodDuration =
    periodEnd.getTime()
    - periodStart.getTime();

  const distanceFromEnd =
    periodEnd.getTime()
    - closeDate.getTime();

  const normalizedPosition =
    periodDuration > 0
      ? distanceFromEnd / periodDuration
      : 0;

  if (normalizedPosition >= 0.65) {
    return 0.08;
  }

  if (normalizedPosition >= 0.3) {
    return 0.03;
  }

  return -0.05;
};

const calculateActivityAdjustment = (
  opportunity:
    RevenuePredictionOpportunityInput,
): number => {
  const inactivity =
    opportunity.daysSinceLastActivity;

  if (inactivity === undefined) {
    return -0.03;
  }

  if (inactivity >= 45) {
    return -0.25;
  }

  if (inactivity >= 30) {
    return -0.18;
  }

  if (inactivity >= 14) {
    return -0.1;
  }

  if (inactivity <= 3) {
    return 0.08;
  }

  if (inactivity <= 7) {
    return 0.04;
  }

  return 0;
};

const calculateMomentumAdjustment = (
  opportunity:
    RevenuePredictionOpportunityInput,
): number => {
  const momentum =
    normalizePercentage(
      opportunity.momentumScore,
      50,
    );

  if (momentum >= 85) {
    return 0.15;
  }

  if (momentum >= 70) {
    return 0.1;
  }

  if (momentum >= 55) {
    return 0.04;
  }

  if (momentum <= 20) {
    return -0.2;
  }

  if (momentum <= 35) {
    return -0.1;
  }

  return 0;
};

const calculateCategoryAdjustment = (
  opportunity:
    RevenuePredictionOpportunityInput,
): number => {
  if (
    opportunity.committed
    || opportunity.pipelineCategory === "commit"
  ) {
    return 0.12;
  }

  if (
    opportunity.bestCase
    || opportunity.pipelineCategory
      === "best-case"
  ) {
    return 0.04;
  }

  if (
    opportunity.pipelineCategory
    === "omitted"
  ) {
    return -0.4;
  }

  return 0;
};

export class DefaultRevenuePredictionProbabilityModel
  implements RevenuePredictionProbabilityModel {
  calculate(
    input: RevenuePredictionModelInput,
  ): RevenuePredictionModelResult {
    const { context, opportunity } = input;

    const periodStart =
      new Date(context.periodStart);

    const periodEnd =
      new Date(context.periodEnd);

    const baseProbability =
      resolveBaseProbability(opportunity);

    const riskAdjustment =
      calculateRiskAdjustment(opportunity);

    const timingAdjustment =
      calculateTimingAdjustment(
        opportunity,
        periodStart,
        periodEnd,
      );

    const activityAdjustment =
      calculateActivityAdjustment(
        opportunity,
      );

    const momentumAdjustment =
      calculateMomentumAdjustment(
        opportunity,
      );

    const categoryAdjustment =
      calculateCategoryAdjustment(
        opportunity,
      );

    const opportunityScoreAdjustment =
      opportunity.opportunityScore
        === undefined
        ? 0
        : (
          normalizePercentage(
            opportunity.opportunityScore,
            50,
          ) - 50
        ) / 500;

    const normalizedProbability =
      clamp(
        (
          baseProbability / 100
          + riskAdjustment
          + timingAdjustment
          + activityAdjustment
          + momentumAdjustment
          + categoryAdjustment
          + opportunityScoreAdjustment
        ),
        0,
        1,
      );

    return {
      probability:
        normalizedProbability,

      riskAdjustment,
      timingAdjustment,
      activityAdjustment,
      momentumAdjustment,

      conservativeMultiplier:
        clamp(
          normalizedProbability * 0.72,
          0,
          1,
        ),

      baseMultiplier:
        normalizedProbability,

      optimisticMultiplier:
        clamp(
          normalizedProbability * 1.22,
          0,
          1,
        ),
    };
  }
}

export const resolveRevenuePredictionConfidence = (
  score: number,
): RevenuePredictionConfidence => {
  if (score >= 85) {
    return "very-high";
  }

  if (score >= 70) {
    return "high";
  }

  if (score >= 50) {
    return "medium";
  }

  if (score >= 30) {
    return "low";
  }

  return "very-low";
};

export const resolveRevenuePredictionRiskLevel = (
  score: number,
): RevenuePredictionRiskLevel => {
  if (score >= 85) {
    return "critical";
  }

  if (score >= 65) {
    return "high";
  }

  if (score >= 40) {
    return "medium";
  }

  return "low";
};

export const resolveRevenuePredictionTrend = (
  current: number,
  previous?: number,
): {
  trend: RevenuePredictionTrend;
  percentage?: number;
} => {
  if (
    previous === undefined
    || previous === 0
  ) {
    return {
      trend: "stable",
    };
  }

  const percentage =
    ((current - previous) / previous)
    * 100;

  if (percentage <= -20) {
    return {
      trend: "strong-decline",
      percentage,
    };
  }

  if (percentage <= -5) {
    return {
      trend: "decline",
      percentage,
    };
  }

  if (percentage >= 20) {
    return {
      trend: "strong-growth",
      percentage,
    };
  }

  if (percentage >= 5) {
    return {
      trend: "growth",
      percentage,
    };
  }

  return {
    trend: "stable",
    percentage,
  };
};

export const resolveScenarioFactor = (
  scenario: RevenuePredictionScenario,
): number => {
  switch (scenario) {
    case "conservative":
      return 0.75;

    case "optimistic":
      return 1.2;

    case "base":
    default:
      return 1;
  }
};

export const createRevenuePredictionProbabilityModel =
  (): RevenuePredictionProbabilityModel =>
    new DefaultRevenuePredictionProbabilityModel();
