import type {
  PipelineHealthConfiguration,
  PipelineHealthGrade,
  PipelineHealthOpportunityInput,
  PipelineHealthRiskLevel,
  PipelineHealthTrend,
} from "./PipelineHealthTypes";

export const clampPipelineHealthScore = (
  value: number,
): number =>
  Math.min(
    100,
    Math.max(0, value),
  );

export const roundPipelineHealthNumber = (
  value: number,
): number =>
  Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;

export const resolvePipelineHealthGrade = (
  score: number,
  configuration:
    PipelineHealthConfiguration,
): PipelineHealthGrade => {
  if (
    score
    >= configuration.excellentThreshold
  ) {
    return "excellent";
  }

  if (
    score
    >= configuration.healthyThreshold
  ) {
    return "healthy";
  }

  if (
    score
    >= configuration.watchThreshold
  ) {
    return "watch";
  }

  if (
    score
    >= configuration.atRiskThreshold
  ) {
    return "at-risk";
  }

  return "critical";
};

export const resolvePipelineHealthRiskLevel = (
  score: number,
): PipelineHealthRiskLevel => {
  if (score >= 80) {
    return "critical";
  }

  if (score >= 60) {
    return "high";
  }

  if (score >= 35) {
    return "medium";
  }

  return "low";
};

export const resolvePipelineHealthTrend = (
  current: number,
  previous?: number,
): {
  trend: PipelineHealthTrend;
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
    (
      (current - previous)
      / Math.abs(previous)
    ) * 100;

  if (percentage <= -15) {
    return {
      trend: "strong-decline",
      percentage:
        roundPipelineHealthNumber(
          percentage,
        ),
    };
  }

  if (percentage <= -5) {
    return {
      trend: "decline",
      percentage:
        roundPipelineHealthNumber(
          percentage,
        ),
    };
  }

  if (percentage >= 15) {
    return {
      trend: "strong-improvement",
      percentage:
        roundPipelineHealthNumber(
          percentage,
        ),
    };
  }

  if (percentage >= 5) {
    return {
      trend: "improving",
      percentage:
        roundPipelineHealthNumber(
          percentage,
        ),
    };
  }

  return {
    trend: "stable",
    percentage:
      roundPipelineHealthNumber(
        percentage,
      ),
  };
};

export const resolvePipelineWeightedAmount = (
  opportunity:
    PipelineHealthOpportunityInput,
): number => {
  if (
    opportunity.weightedAmount
    !== undefined
    && Number.isFinite(
      opportunity.weightedAmount,
    )
  ) {
    return Math.max(
      0,
      opportunity.weightedAmount,
    );
  }

  const probability =
    opportunity.winProbability
    ?? opportunity.stageProbability
    ?? 50;

  const normalizedProbability =
    Math.min(
      100,
      Math.max(0, probability),
    ) / 100;

  return Math.max(
    0,
    opportunity.amount,
  ) * normalizedProbability;
};

export const resolveOpportunityDaysInStage = (
  opportunity:
    PipelineHealthOpportunityInput,
  now: Date,
): number => {
  if (
    opportunity.daysInStage
    !== undefined
    && Number.isFinite(
      opportunity.daysInStage,
    )
  ) {
    return Math.max(
      0,
      opportunity.daysInStage,
    );
  }

  if (!opportunity.enteredStageAt) {
    return 0;
  }

  const enteredAt =
    new Date(
      opportunity.enteredStageAt,
    );

  if (
    Number.isNaN(
      enteredAt.getTime(),
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(
      (
        now.getTime()
        - enteredAt.getTime()
      )
      / (
        24
        * 60
        * 60
        * 1000
      ),
    ),
  );
};

export const resolveOpportunityInactivityDays = (
  opportunity:
    PipelineHealthOpportunityInput,
  now: Date,
): number => {
  if (
    opportunity.daysSinceLastActivity
    !== undefined
    && Number.isFinite(
      opportunity.daysSinceLastActivity,
    )
  ) {
    return Math.max(
      0,
      opportunity.daysSinceLastActivity,
    );
  }

  if (!opportunity.lastActivityAt) {
    return 999;
  }

  const lastActivityAt =
    new Date(
      opportunity.lastActivityAt,
    );

  if (
    Number.isNaN(
      lastActivityAt.getTime(),
    )
  ) {
    return 999;
  }

  return Math.max(
    0,
    Math.floor(
      (
        now.getTime()
        - lastActivityAt.getTime()
      )
      / (
        24
        * 60
        * 60
        * 1000
      ),
    ),
  );
};

export const averagePipelineHealthValue = (
  values: readonly number[],
): number => {
  if (values.length === 0) {
    return 0;
  }

  return (
    values.reduce(
      (total, value) =>
        total + value,
      0,
    )
    / values.length
  );
};
