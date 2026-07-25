import type {
  PredictiveRiskConfiguration,
  PredictiveRiskSeverity,
  PredictiveRiskTrend,
} from "./PredictiveRiskTypes";

export const clampPredictiveRiskScore = (
  value: number,
): number =>
  Math.min(
    100,
    Math.max(0, value),
  );

export const roundPredictiveRiskNumber = (
  value: number,
): number =>
  Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;

export const resolvePredictiveRiskSeverity = (
  score: number,
  configuration:
    PredictiveRiskConfiguration,
): PredictiveRiskSeverity => {
  if (
    score
    >= configuration.criticalRiskThreshold
  ) {
    return "critical";
  }

  if (
    score
    >= configuration.highRiskThreshold
  ) {
    return "high";
  }

  if (
    score
    >= configuration.mediumRiskThreshold
  ) {
    return "medium";
  }

  return "low";
};

export const resolvePredictiveRiskTrend = (
  current: number,
  previous?: number,
): {
  trend: PredictiveRiskTrend;
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

  if (percentage >= 20) {
    return {
      trend: "rapidly-increasing",
      percentage:
        roundPredictiveRiskNumber(
          percentage,
        ),
    };
  }

  if (percentage >= 5) {
    return {
      trend: "increasing",
      percentage:
        roundPredictiveRiskNumber(
          percentage,
        ),
    };
  }

  if (percentage <= -5) {
    return {
      trend: "decreasing",
      percentage:
        roundPredictiveRiskNumber(
          percentage,
        ),
    };
  }

  return {
    trend: "stable",
    percentage:
      roundPredictiveRiskNumber(
        percentage,
      ),
  };
};

export const resolvePredictiveWeightedAmount = (
  amount: number,
  weightedAmount?: number,
  winProbability?: number,
  stageProbability?: number,
): number => {
  if (
    weightedAmount !== undefined
    && Number.isFinite(weightedAmount)
  ) {
    return Math.max(
      0,
      weightedAmount,
    );
  }

  const probability =
    winProbability
    ?? stageProbability
    ?? 50;

  return (
    Math.max(0, amount)
    * Math.min(
      1,
      Math.max(
        0,
        probability / 100,
      ),
    )
  );
};

export const resolveDaysBetween = (
  earlier: string | undefined,
  later: Date,
  fallback: number,
): number => {
  if (!earlier) {
    return fallback;
  }

  const parsed =
    new Date(earlier);

  if (
    Number.isNaN(
      parsed.getTime(),
    )
  ) {
    return fallback;
  }

  return Math.max(
    0,
    Math.floor(
      (
        later.getTime()
        - parsed.getTime()
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

export const predictiveRiskSeverityWeight:
  Readonly<Record<
    PredictiveRiskSeverity,
    number
  >> = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4,
  };

