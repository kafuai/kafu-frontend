import type {
  RevenuePredictionContext,
  RevenuePredictionSignalKey,
  RevenuePredictionSignalResult,
} from "./RevenuePredictionTypes";

export interface RevenuePredictionSignalDefinition {
  key: RevenuePredictionSignalKey;
  label: string;
  defaultCoefficient: number;

  evaluate(
    context: RevenuePredictionContext,
    coefficient: number,
  ): RevenuePredictionSignalResult;
}

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number =>
  Math.min(maximum, Math.max(minimum, value));

const normalizePercent = (
  value: number | null | undefined,
): number | null => {
  if (
    value === null
    || value === undefined
    || !Number.isFinite(value)
  ) {
    return null;
  }

  return clamp(value <= 1 ? value * 100 : value);
};

const createUnavailableSignal = (
  key: RevenuePredictionSignalKey,
  label: string,
  coefficient: number,
  reason: string,
): RevenuePredictionSignalResult => ({
  key,
  label,
  normalizedValue: 0,
  coefficient,
  contribution: 0,
  confidence: 0,
  available: false,
  reason,
  evidence: [],
});

const createSignal = (
  key: RevenuePredictionSignalKey,
  label: string,
  normalizedValue: number,
  coefficient: number,
  confidence: number,
  reason: string,
  evidence: readonly string[],
): RevenuePredictionSignalResult => {
  const value = clamp(normalizedValue);
  const centeredValue = (value - 50) / 50;

  return {
    key,
    label,
    normalizedValue: value,
    coefficient,
    contribution: centeredValue * coefficient,
    confidence: clamp(confidence),
    available: true,
    reason,
    evidence,
  };
};

const dealValueSignal: RevenuePredictionSignalDefinition = {
  key: "dealValue",
  label: "Deal Value Integrity",
  defaultCoefficient: 0.55,

  evaluate(context, coefficient) {
    if (
      !Number.isFinite(context.dealValue)
      || context.dealValue <= 0
    ) {
      return createUnavailableSignal(
        this.key,
        this.label,
        coefficient,
        "A valid positive opportunity value is unavailable.",
      );
    }

    return createSignal(
      this.key,
      this.label,
      100,
      coefficient,
      100,
      "The opportunity has a valid commercial value.",
      [
        `Deal value: ${context.dealValue}`,
        `Currency: ${context.currency}`,
      ],
    );
  },
};

const winProbabilitySignal:
  RevenuePredictionSignalDefinition = {
    key: "winProbability",
    label: "Win Probability",
    defaultCoefficient: 1.4,

    evaluate(context, coefficient) {
      return createSignal(
        this.key,
        this.label,
        context.winProbability.probability,
        coefficient,
        context.winProbability.confidence,
        "Predicted conversion probability is the primary revenue-weighting signal.",
        [
          `Win probability: ${context.winProbability.probability}`,
          `Probability trend: ${context.winProbability.trend}`,
        ],
      );
    },
  };

const opportunityQualitySignal:
  RevenuePredictionSignalDefinition = {
    key: "opportunityQuality",
    label: "Opportunity Quality",
    defaultCoefficient: 1,

    evaluate(context, coefficient) {
      return createSignal(
        this.key,
        this.label,
        context.opportunityScore.score,
        coefficient,
        context.opportunityScore.confidence,
        "Opportunity quality influences expected revenue realization.",
        [
          `Opportunity score: ${context.opportunityScore.score}`,
          `Opportunity risk: ${context.opportunityScore.riskLevel}`,
        ],
      );
    },
  };

const stageMaturitySignal:
  RevenuePredictionSignalDefinition = {
    key: "stageMaturity",
    label: "Stage Maturity",
    defaultCoefficient: 0.85,

    evaluate(context, coefficient) {
      const stageProbability = normalizePercent(
        context.stageProbability,
      );

      if (stageProbability === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Calibrated pipeline-stage probability is unavailable.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        stageProbability,
        coefficient,
        85,
        "Pipeline maturity adjusts revenue realization expectations.",
        [
          `Stage: ${context.stage ?? "Unknown"}`,
          `Stage probability: ${stageProbability}`,
        ],
      );
    },
  };

const closeDateReliabilitySignal:
  RevenuePredictionSignalDefinition = {
    key: "closeDateReliability",
    label: "Close-Date Reliability",
    defaultCoefficient: 0.75,

    evaluate(context, coefficient) {
      if (!context.expectedCloseDate) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Expected close date is unavailable.",
        );
      }

      const closeDate = new Date(context.expectedCloseDate);

      if (Number.isNaN(closeDate.getTime())) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Expected close date is invalid.",
        );
      }

      const changeCount =
        context.closeDateChangeCount ?? 0;

      const value = clamp(
        100 - changeCount * 18,
      );

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        75,
        changeCount <= 1
          ? "The expected close date is stable."
          : "Repeated close-date changes are reducing forecast reliability.",
        [
          `Expected close date: ${closeDate.toISOString()}`,
          `Close-date changes: ${changeCount}`,
        ],
      );
    },
  };

const forecastConfidenceSignal:
  RevenuePredictionSignalDefinition = {
    key: "forecastConfidence",
    label: "Forecast Confidence",
    defaultCoefficient: 0.85,

    evaluate(context, coefficient) {
      const confidence = normalizePercent(
        context.forecastConfidence,
      );

      if (confidence === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Forecast-confidence evidence is unavailable.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        confidence,
        coefficient,
        85,
        confidence >= 70
          ? "Commercial evidence supports the expected revenue outcome."
          : "Forecast evidence is currently weak.",
        [`Forecast confidence: ${confidence}`],
      );
    },
  };

const engagementMomentumSignal:
  RevenuePredictionSignalDefinition = {
    key: "engagementMomentum",
    label: "Engagement Momentum",
    defaultCoefficient: 0.8,

    evaluate(context, coefficient) {
      const engagement = normalizePercent(
        context.engagementScore,
      );

      if (engagement === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Customer engagement evidence is unavailable.",
        );
      }

      const adjustment =
        context.engagementTrend === "improving"
          ? 10
          : context.engagementTrend === "declining"
            ? -15
            : 0;

      const value = clamp(engagement + adjustment);

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        80,
        context.engagementTrend === "declining"
          ? "Declining customer engagement is reducing expected revenue."
          : "Customer engagement supports revenue realization.",
        [
          `Engagement score: ${engagement}`,
          `Engagement trend: ${context.engagementTrend ?? "stable"}`,
        ],
      );
    },
  };

const activityMomentumSignal:
  RevenuePredictionSignalDefinition = {
    key: "activityMomentum",
    label: "Activity Momentum",
    defaultCoefficient: 0.65,

    evaluate(context, coefficient) {
      const daysSinceLastActivity =
        context.daysSinceLastActivity;

      if (
        daysSinceLastActivity === null
        || daysSinceLastActivity === undefined
        || !Number.isFinite(daysSinceLastActivity)
        || daysSinceLastActivity < 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Recent activity evidence is unavailable.",
        );
      }

      const recencyScore =
        daysSinceLastActivity <= 2
          ? 100
          : daysSinceLastActivity <= 7
            ? 80
            : daysSinceLastActivity <= 14
              ? 60
              : daysSinceLastActivity <= 30
                ? 35
                : 10;

      const activityCount =
        context.activityCount30Days ?? 0;

      const frequencyScore = clamp(
        activityCount * 10,
      );

      const value =
        recencyScore * 0.65
        + frequencyScore * 0.35;

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        80,
        daysSinceLastActivity <= 7
          ? "Recent sales activity supports revenue conversion."
          : "Opportunity inactivity is reducing expected revenue.",
        [
          `Days since last activity: ${daysSinceLastActivity}`,
          `Activities in 30 days: ${activityCount}`,
        ],
      );
    },
  };

const historicalPerformanceSignal:
  RevenuePredictionSignalDefinition = {
    key: "historicalPerformance",
    label: "Historical Performance",
    defaultCoefficient: 0.65,

    evaluate(context, coefficient) {
      const historicalWinRate = normalizePercent(
        context.historicalWinRate,
      );

      if (historicalWinRate === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Historical win-rate evidence is unavailable.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        historicalWinRate,
        coefficient,
        75,
        historicalWinRate >= 60
          ? "Comparable historical opportunities support revenue conversion."
          : "Comparable historical performance indicates lower realization.",
        [`Historical win rate: ${historicalWinRate}`],
      );
    },
  };

const riskAdjustmentSignal:
  RevenuePredictionSignalDefinition = {
    key: "riskAdjustment",
    label: "Risk Adjustment",
    defaultCoefficient: 1,

    evaluate(context, coefficient) {
      const predictiveRisk = normalizePercent(
        context.predictiveRiskScore,
      );

      if (predictiveRisk !== null) {
        return createSignal(
          this.key,
          this.label,
          100 - predictiveRisk,
          coefficient,
          85,
          predictiveRisk <= 30
            ? "Predictive risk remains controlled."
            : "Predictive risk is reducing expected revenue.",
          [`Predictive risk: ${predictiveRisk}`],
        );
      }

      const riskLevel =
        context.currentRiskLevel
        ?? context.opportunityScore.riskLevel;

      const value =
        riskLevel === "low"
          ? 90
          : riskLevel === "moderate"
            ? 65
            : riskLevel === "high"
              ? 35
              : 10;

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        70,
        riskLevel === "low"
          ? "Opportunity risk is controlled."
          : "Opportunity risk is reducing revenue realization.",
        [`Risk level: ${riskLevel}`],
      );
    },
  };

export const revenuePredictionSignals:
  readonly RevenuePredictionSignalDefinition[] = [
    dealValueSignal,
    winProbabilitySignal,
    opportunityQualitySignal,
    stageMaturitySignal,
    closeDateReliabilitySignal,
    forecastConfidenceSignal,
    engagementMomentumSignal,
    activityMomentumSignal,
    historicalPerformanceSignal,
    riskAdjustmentSignal,
  ];

export const createRevenuePredictionSignals = (
  coefficientOverrides: Partial<
    Record<RevenuePredictionSignalKey, number>
  > = {},
): readonly RevenuePredictionSignalDefinition[] =>
  revenuePredictionSignals.map((signal) => ({
    ...signal,
    defaultCoefficient:
      coefficientOverrides[signal.key]
      ?? signal.defaultCoefficient,
  }));
