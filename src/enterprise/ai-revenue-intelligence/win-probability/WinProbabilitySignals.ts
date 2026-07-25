import type {
  WinProbabilityContext,
  WinProbabilitySignalKey,
  WinProbabilitySignalResult,
} from "./WinProbabilityTypes";

export interface WinProbabilitySignalDefinition {
  key: WinProbabilitySignalKey;
  label: string;
  defaultCoefficient: number;
  evaluate(
    context: WinProbabilityContext,
    coefficient: number,
  ): WinProbabilitySignalResult;
}

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number => Math.min(maximum, Math.max(minimum, value));

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
  key: WinProbabilitySignalKey,
  label: string,
  coefficient: number,
  reason: string,
): WinProbabilitySignalResult => ({
  key,
  label,
  value: 0,
  normalizedValue: 0,
  coefficient,
  contribution: 0,
  confidence: 0,
  available: false,
  reason,
  evidence: [],
});

const createSignal = (
  key: WinProbabilitySignalKey,
  label: string,
  value: number,
  coefficient: number,
  confidence: number,
  reason: string,
  evidence: readonly string[],
): WinProbabilitySignalResult => {
  const normalizedValue = clamp(value);
  const centeredValue = (normalizedValue - 50) / 50;

  return {
    key,
    label,
    value: normalizedValue,
    normalizedValue,
    coefficient,
    contribution: centeredValue * coefficient,
    confidence: clamp(confidence),
    available: true,
    reason,
    evidence,
  };
};

const opportunityScoreSignal: WinProbabilitySignalDefinition = {
  key: "opportunityScore",
  label: "Opportunity Score",
  defaultCoefficient: 1.35,
  evaluate(context, coefficient) {
    return createSignal(
      this.key,
      this.label,
      context.opportunityScore.score,
      coefficient,
      context.opportunityScore.confidence,
      "The AI opportunity score provides the primary conversion-quality signal.",
      [
        `Opportunity score: ${context.opportunityScore.score.toFixed(2)}`,
        `Opportunity risk: ${context.opportunityScore.riskLevel}`,
      ],
    );
  },
};

const stageMaturitySignal: WinProbabilitySignalDefinition = {
  key: "stageMaturity",
  label: "Stage Maturity",
  defaultCoefficient: 0.95,
  evaluate(context, coefficient) {
    const stageProbability = normalizePercent(
      context.stageProbability,
    );

    if (stageProbability === null) {
      return createUnavailableSignal(
        this.key,
        this.label,
        coefficient,
        "No calibrated stage probability is available.",
      );
    }

    return createSignal(
      this.key,
      this.label,
      stageProbability,
      coefficient,
      85,
      "Pipeline maturity influences the likelihood of conversion.",
      [
        `Stage: ${context.stage ?? "Unknown"}`,
        `Stage probability: ${stageProbability.toFixed(2)}`,
      ],
    );
  },
};

const engagementMomentumSignal:
  WinProbabilitySignalDefinition = {
    key: "engagementMomentum",
    label: "Engagement Momentum",
    defaultCoefficient: 1.05,
    evaluate(context, coefficient) {
      const engagement = normalizePercent(
        context.engagementScore,
      );

      if (engagement === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Engagement scoring evidence is unavailable.",
        );
      }

      const trendAdjustment =
        context.engagementTrend === "improving"
          ? 10
          : context.engagementTrend === "declining"
            ? -15
            : 0;

      const value = clamp(engagement + trendAdjustment);

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        85,
        context.engagementTrend === "declining"
          ? "Declining engagement is reducing win likelihood."
          : "Customer engagement is supporting opportunity momentum.",
        [
          `Engagement score: ${engagement.toFixed(2)}`,
          `Engagement trend: ${context.engagementTrend ?? "stable"}`,
        ],
      );
    },
  };

const stakeholderCoverageSignal:
  WinProbabilitySignalDefinition = {
    key: "stakeholderCoverage",
    label: "Stakeholder Coverage",
    defaultCoefficient: 1,
    evaluate(context, coefficient) {
      const decisionMakerCoverage = normalizePercent(
        context.decisionMakerCoverage,
      );

      const executiveEngagement = normalizePercent(
        context.executiveEngagementScore,
      );

      if (
        decisionMakerCoverage === null
        && executiveEngagement === null
      ) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Buying-committee and executive coverage are unavailable.",
        );
      }

      const values = [
        decisionMakerCoverage,
        executiveEngagement,
      ].filter((value): value is number => value !== null);

      const value =
        values.reduce((total, current) => total + current, 0)
        / values.length;

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        values.length === 2 ? 90 : 65,
        value >= 70
          ? "The opportunity has healthy buying-committee coverage."
          : "Stakeholder access remains insufficient.",
        [
          decisionMakerCoverage === null
            ? "Decision-maker coverage unavailable."
            : `Decision-maker coverage: ${decisionMakerCoverage.toFixed(2)}`,
          executiveEngagement === null
            ? "Executive engagement unavailable."
            : `Executive engagement: ${executiveEngagement.toFixed(2)}`,
        ],
      );
    },
  };

const commercialConfidenceSignal:
  WinProbabilitySignalDefinition = {
    key: "commercialConfidence",
    label: "Commercial Confidence",
    defaultCoefficient: 0.85,
    evaluate(context, coefficient) {
      const forecastConfidence = normalizePercent(
        context.forecastConfidence,
      );

      if (forecastConfidence === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Forecast confidence is unavailable.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        forecastConfidence,
        coefficient,
        85,
        forecastConfidence >= 70
          ? "Commercial evidence supports the current forecast."
          : "Commercial evidence does not yet support a reliable forecast.",
        [`Forecast confidence: ${forecastConfidence.toFixed(2)}`],
      );
    },
  };

const closeDateReliabilitySignal:
  WinProbabilitySignalDefinition = {
    key: "closeDateReliability",
    label: "Close-Date Reliability",
    defaultCoefficient: 0.65,
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

      const changes = context.closeDateChangeCount ?? 0;
      const value = clamp(100 - changes * 18);

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        70,
        changes <= 1
          ? "The expected close date has remained stable."
          : "Repeated close-date movement is reducing forecast reliability.",
        [
          `Expected close date: ${closeDate.toISOString()}`,
          `Close-date changes: ${changes}`,
        ],
      );
    },
  };

const competitivePositionSignal:
  WinProbabilitySignalDefinition = {
    key: "competitivePosition",
    label: "Competitive Position",
    defaultCoefficient: 0.7,
    evaluate(context, coefficient) {
      const pressure = normalizePercent(
        context.competitorPressureScore,
      );

      if (pressure !== null) {
        return createSignal(
          this.key,
          this.label,
          100 - pressure,
          coefficient,
          80,
          pressure <= 30
            ? "Competitive pressure is manageable."
            : "Competitive pressure is reducing the expected win rate.",
          [`Competitive pressure: ${pressure.toFixed(2)}`],
        );
      }

      if (
        context.competitorCount === null
        || context.competitorCount === undefined
      ) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Competitive-position evidence is unavailable.",
        );
      }

      const value = clamp(
        100 - context.competitorCount * 20,
      );

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        55,
        context.competitorCount <= 1
          ? "Known competitive pressure is limited."
          : "Multiple competitors are creating conversion pressure.",
        [`Known competitors: ${context.competitorCount}`],
      );
    },
  };

const activityRecencySignal:
  WinProbabilitySignalDefinition = {
    key: "activityRecency",
    label: "Activity Recency",
    defaultCoefficient: 0.8,
    evaluate(context, coefficient) {
      const days = context.daysSinceLastActivity;

      if (
        days === null
        || days === undefined
        || !Number.isFinite(days)
        || days < 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Last-activity recency is unavailable.",
        );
      }

      const value =
        days <= 2
          ? 100
          : days <= 7
            ? 80
            : days <= 14
              ? 60
              : days <= 30
                ? 35
                : 10;

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        85,
        days <= 7
          ? "Recent customer activity supports opportunity momentum."
          : "The opportunity is becoming inactive.",
        [
          `Days since last activity: ${days}`,
          `Activities in 30 days: ${context.activityCount30Days ?? "Unknown"}`,
        ],
      );
    },
  };

const historicalPerformanceSignal:
  WinProbabilitySignalDefinition = {
    key: "historicalPerformance",
    label: "Historical Performance",
    defaultCoefficient: 0.65,
    evaluate(context, coefficient) {
      const winRate = normalizePercent(
        context.historicalWinRate,
      );

      if (winRate === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Historical performance evidence is unavailable.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        winRate,
        coefficient,
        75,
        winRate >= 60
          ? "Comparable historical performance supports conversion."
          : "Comparable historical performance indicates lower conversion.",
        [`Historical win rate: ${winRate.toFixed(2)}`],
      );
    },
  };

const riskAdjustmentSignal:
  WinProbabilitySignalDefinition = {
    key: "riskAdjustment",
    label: "Risk Adjustment",
    defaultCoefficient: 1.1,
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
            : "Predictive risk signals are reducing win probability.",
          [`Predictive risk: ${predictiveRisk.toFixed(2)}`],
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
          ? "Current opportunity risk is controlled."
          : "Current opportunity risk is reducing conversion likelihood.",
        [`Opportunity risk level: ${riskLevel}`],
      );
    },
  };

export const winProbabilitySignals:
  readonly WinProbabilitySignalDefinition[] = [
    opportunityScoreSignal,
    stageMaturitySignal,
    engagementMomentumSignal,
    stakeholderCoverageSignal,
    commercialConfidenceSignal,
    closeDateReliabilitySignal,
    competitivePositionSignal,
    activityRecencySignal,
    historicalPerformanceSignal,
    riskAdjustmentSignal,
  ];

export const createWinProbabilitySignals = (
  coefficientOverrides: Partial<
    Record<WinProbabilitySignalKey, number>
  > = {},
): readonly WinProbabilitySignalDefinition[] =>
  winProbabilitySignals.map((signal) => ({
    ...signal,
    defaultCoefficient:
      coefficientOverrides[signal.key]
      ?? signal.defaultCoefficient,
  }));
