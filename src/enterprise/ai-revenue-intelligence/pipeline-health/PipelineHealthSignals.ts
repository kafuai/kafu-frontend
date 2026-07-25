import type {
  PipelineHealthContext,
  PipelineHealthSignalKey,
  PipelineHealthSignalResult,
} from "./PipelineHealthTypes";

export interface PipelineHealthSignalDefinition {
  key: PipelineHealthSignalKey;
  label: string;
  defaultWeight: number;

  evaluate(
    context: PipelineHealthContext,
    weight: number,
  ): PipelineHealthSignalResult;
}

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number =>
  Math.min(maximum, Math.max(minimum, value));

const round = (
  value: number,
  precision = 2,
): number => {
  const multiplier = 10 ** precision;

  return (
    Math.round(value * multiplier)
    / multiplier
  );
};

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

  return clamp(
    value <= 1
      ? value * 100
      : value,
  );
};

const createUnavailableSignal = (
  key: PipelineHealthSignalKey,
  label: string,
  weight: number,
  reason: string,
): PipelineHealthSignalResult => ({
  key,
  label,
  score: 0,
  weight,
  weightedScore: 0,
  confidence: 0,
  available: false,
  reason,
  evidence: [],
});

const createSignal = (
  key: PipelineHealthSignalKey,
  label: string,
  score: number,
  weight: number,
  confidence: number,
  reason: string,
  evidence: readonly string[],
): PipelineHealthSignalResult => {
  const normalizedScore = clamp(score);

  return {
    key,
    label,
    score: round(normalizedScore),
    weight,
    weightedScore:
      round(normalizedScore * weight, 4),
    confidence: round(
      clamp(confidence),
    ),
    available: true,
    reason,
    evidence,
  };
};

const calculateTotalValue = (
  context: PipelineHealthContext,
): number =>
  context.opportunities.reduce(
    (total, opportunity) =>
      total
      + (
        Number.isFinite(opportunity.dealValue)
          ? Math.max(
              0,
              opportunity.dealValue,
            )
          : 0
      ),
    0,
  );

const coverageSignal:
  PipelineHealthSignalDefinition = {
    key: "coverage",
    label: "Revenue Coverage",
    defaultWeight: 1.25,

    evaluate(context, weight) {
      const targetRevenue =
        context.targetRevenue;

      if (
        targetRevenue === null
        || targetRevenue === undefined
        || !Number.isFinite(targetRevenue)
        || targetRevenue <= 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "A valid revenue target is unavailable.",
        );
      }

      const totalValue =
        calculateTotalValue(context);

      const coverageRatio =
        totalValue / targetRevenue;

      const score =
        coverageRatio >= 4
          ? 100
          : coverageRatio >= 3
            ? 90
            : coverageRatio >= 2
              ? 75
              : coverageRatio >= 1.5
                ? 60
                : coverageRatio >= 1
                  ? 40
                  : 20;

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        95,
        coverageRatio >= 3
          ? "Pipeline coverage is sufficient to support the revenue target."
          : "Pipeline coverage may be insufficient for the current target.",
        [
          `Pipeline value: ${round(totalValue)}`,
          `Revenue target: ${round(targetRevenue)}`,
          `Coverage ratio: ${round(coverageRatio, 3)}`,
        ],
      );
    },
  };

const conversionQualitySignal:
  PipelineHealthSignalDefinition = {
    key: "conversionQuality",
    label: "Conversion Quality",
    defaultWeight: 1.2,

    evaluate(context, weight) {
      const probabilities =
        context.opportunities
          .map(
            (opportunity) =>
              opportunity.winProbability
                ?.probability,
          )
          .filter(
            (value): value is number =>
              value !== undefined
              && Number.isFinite(value),
          );

      if (probabilities.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Win-probability evidence is unavailable.",
        );
      }

      const average =
        probabilities.reduce(
          (total, value) => total + value,
          0,
        ) / probabilities.length;

      return createSignal(
        this.key,
        this.label,
        average,
        weight,
        (
          probabilities.length
          / context.opportunities.length
        ) * 100,
        average >= 65
          ? "Pipeline opportunities have strong predicted conversion quality."
          : "Predicted conversion quality requires improvement.",
        [
          `Average win probability: ${round(average)}`,
          `Covered opportunities: ${probabilities.length}`,
        ],
      );
    },
  };

const revenueConfidenceSignal:
  PipelineHealthSignalDefinition = {
    key: "revenueConfidence",
    label: "Revenue Confidence",
    defaultWeight: 1.15,

    evaluate(context, weight) {
      const predictions =
        context.opportunities
          .map(
            (opportunity) =>
              opportunity.revenuePrediction,
          )
          .filter(
            (
              prediction,
            ): prediction is NonNullable<
              typeof prediction
            > => prediction !== null
              && prediction !== undefined,
          );

      if (predictions.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Revenue-prediction evidence is unavailable.",
        );
      }

      const averageConfidence =
        predictions.reduce(
          (total, prediction) =>
            total + prediction.confidence,
          0,
        ) / predictions.length;

      const criticalCount =
        predictions.filter(
          (prediction) =>
            prediction.riskLevel
            === "critical",
        ).length;

      const riskPenalty =
        (
          criticalCount
          / predictions.length
        ) * 30;

      return createSignal(
        this.key,
        this.label,
        averageConfidence - riskPenalty,
        weight,
        (
          predictions.length
          / context.opportunities.length
        ) * 100,
        criticalCount === 0
          ? "Revenue predictions are supported by reliable evidence."
          : "Critical revenue-prediction risks are reducing confidence.",
        [
          `Average prediction confidence: ${round(averageConfidence)}`,
          `Critical predictions: ${criticalCount}`,
        ],
      );
    },
  };

const stageDistributionSignal:
  PipelineHealthSignalDefinition = {
    key: "stageDistribution",
    label: "Stage Distribution",
    defaultWeight: 0.9,

    evaluate(context, weight) {
      if (context.opportunities.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "The pipeline contains no opportunities.",
        );
      }

      const stageCounts =
        context.opportunities.reduce<
          Record<string, number>
        >((counts, opportunity) => {
          const stage =
            opportunity.stage?.trim()
            || "unknown";

          counts[stage] =
            (counts[stage] ?? 0) + 1;

          return counts;
        }, {});

      const stageValues =
        Object.values(stageCounts);

      const largestStageCount =
        Math.max(...stageValues);

      const concentration =
        largestStageCount
        / context.opportunities.length;

      const unknownCount =
        stageCounts.unknown ?? 0;

      const unknownPenalty =
        (
          unknownCount
          / context.opportunities.length
        ) * 30;

      const concentrationPenalty =
        concentration > 0.7
          ? 30
          : concentration > 0.5
            ? 15
            : 0;

      const score =
        100
        - unknownPenalty
        - concentrationPenalty;

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        80,
        concentration <= 0.5
          ? "Opportunity distribution across stages is balanced."
          : "Pipeline value is concentrated in too few stages.",
        [
          `Distinct stages: ${Object.keys(stageCounts).length}`,
          `Largest-stage concentration: ${round(concentration * 100)}%`,
          `Unknown-stage opportunities: ${unknownCount}`,
        ],
      );
    },
  };

const pipelineVelocitySignal:
  PipelineHealthSignalDefinition = {
    key: "pipelineVelocity",
    label: "Pipeline Velocity",
    defaultWeight: 1,

    evaluate(context, weight) {
      const stageDurations =
        context.opportunities
          .map(
            (opportunity) =>
              opportunity.daysInCurrentStage,
          )
          .filter(
            (value): value is number =>
              value !== null
              && value !== undefined
              && Number.isFinite(value)
              && value >= 0,
          );

      if (stageDurations.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Stage-duration evidence is unavailable.",
        );
      }

      const averageDays =
        stageDurations.reduce(
          (total, value) => total + value,
          0,
        ) / stageDurations.length;

      const score =
        averageDays <= 7
          ? 100
          : averageDays <= 14
            ? 85
            : averageDays <= 30
              ? 65
              : averageDays <= 60
                ? 40
                : 15;

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        (
          stageDurations.length
          / context.opportunities.length
        ) * 100,
        averageDays <= 30
          ? "Opportunities are progressing through the pipeline at a healthy pace."
          : "Extended stage duration indicates pipeline stagnation.",
        [
          `Average days in current stage: ${round(averageDays)}`,
          `Measured opportunities: ${stageDurations.length}`,
        ],
      );
    },
  };

const activityHealthSignal:
  PipelineHealthSignalDefinition = {
    key: "activityHealth",
    label: "Activity Health",
    defaultWeight: 1,

    evaluate(context, weight) {
      const measured =
        context.opportunities.filter(
          (opportunity) =>
            opportunity.daysSinceLastActivity
              !== null
            && opportunity.daysSinceLastActivity
              !== undefined
            && Number.isFinite(
              opportunity.daysSinceLastActivity,
            ),
        );

      if (measured.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Recent-activity evidence is unavailable.",
        );
      }

      const healthyCount =
        measured.filter(
          (opportunity) =>
            (
              opportunity.daysSinceLastActivity
              ?? Number.POSITIVE_INFINITY
            ) <= 7,
        ).length;

      const staleCount =
        measured.filter(
          (opportunity) =>
            (
              opportunity.daysSinceLastActivity
              ?? 0
            ) > 30,
        ).length;

      const healthyRatio =
        healthyCount / measured.length;

      const staleRatio =
        staleCount / measured.length;

      const score =
        healthyRatio * 100
        - staleRatio * 25;

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        (
          measured.length
          / context.opportunities.length
        ) * 100,
        healthyRatio >= 0.7
          ? "Most pipeline opportunities have recent customer activity."
          : "A material portion of the pipeline lacks recent activity.",
        [
          `Recently active opportunities: ${healthyCount}`,
          `Stale opportunities: ${staleCount}`,
          `Measured opportunities: ${measured.length}`,
        ],
      );
    },
  };

const closeDateStabilitySignal:
  PipelineHealthSignalDefinition = {
    key: "closeDateStability",
    label: "Close-Date Stability",
    defaultWeight: 0.8,

    evaluate(context, weight) {
      const measured =
        context.opportunities.filter(
          (opportunity) =>
            opportunity.closeDateChangeCount
              !== null
            && opportunity.closeDateChangeCount
              !== undefined
            && Number.isFinite(
              opportunity.closeDateChangeCount,
            ),
        );

      if (measured.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Close-date change evidence is unavailable.",
        );
      }

      const averageChanges =
        measured.reduce(
          (total, opportunity) =>
            total
            + (
              opportunity.closeDateChangeCount
              ?? 0
            ),
          0,
        ) / measured.length;

      const score =
        clamp(
          100 - averageChanges * 18,
        );

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        (
          measured.length
          / context.opportunities.length
        ) * 100,
        averageChanges <= 1
          ? "Pipeline close dates are stable."
          : "Repeated close-date movement is reducing pipeline reliability.",
        [
          `Average close-date changes: ${round(averageChanges)}`,
          `Measured opportunities: ${measured.length}`,
        ],
      );
    },
  };

const riskConcentrationSignal:
  PipelineHealthSignalDefinition = {
    key: "riskConcentration",
    label: "Risk Concentration",
    defaultWeight: 1.2,

    evaluate(context, weight) {
      const measured =
        context.opportunities.filter(
          (opportunity) =>
            opportunity.riskLevel
            !== null
            && opportunity.riskLevel
            !== undefined,
        );

      if (measured.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Opportunity-risk evidence is unavailable.",
        );
      }

      const totalValue =
        measured.reduce(
          (total, opportunity) =>
            total
            + Math.max(
              0,
              opportunity.dealValue,
            ),
          0,
        );

      if (totalValue <= 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Risk-weighted pipeline value is unavailable.",
        );
      }

      const highRiskValue =
        measured
          .filter(
            (opportunity) =>
              opportunity.riskLevel === "high"
              || opportunity.riskLevel
                === "critical",
          )
          .reduce(
            (total, opportunity) =>
              total
              + Math.max(
                  0,
                  opportunity.dealValue,
                ),
            0,
          );

      const highRiskRatio =
        highRiskValue / totalValue;

      const score =
        100 - highRiskRatio * 100;

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        (
          measured.length
          / context.opportunities.length
        ) * 100,
        highRiskRatio <= 0.25
          ? "High-risk exposure is controlled."
          : "A material portion of pipeline value is concentrated in high-risk opportunities.",
        [
          `High-risk value ratio: ${round(highRiskRatio * 100)}%`,
          `High-risk value: ${round(highRiskValue)}`,
        ],
      );
    },
  };

const dealConcentrationSignal:
  PipelineHealthSignalDefinition = {
    key: "dealConcentration",
    label: "Deal Concentration",
    defaultWeight: 0.75,

    evaluate(context, weight) {
      if (context.opportunities.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "The pipeline contains no opportunities.",
        );
      }

      const values =
        context.opportunities
          .map(
            (opportunity) =>
              Math.max(
                0,
                opportunity.dealValue,
              ),
          )
          .filter(
            (value) => value > 0,
          );

      const totalValue =
        values.reduce(
          (total, value) => total + value,
          0,
        );

      if (
        values.length === 0
        || totalValue <= 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Valid opportunity values are unavailable.",
        );
      }

      const largestDeal =
        Math.max(...values);

      const concentration =
        largestDeal / totalValue;

      const score =
        concentration <= 0.2
          ? 100
          : concentration <= 0.35
            ? 80
            : concentration <= 0.5
              ? 60
              : concentration <= 0.7
                ? 35
                : 15;

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        95,
        concentration <= 0.35
          ? "Pipeline value is distributed across multiple opportunities."
          : "Pipeline performance depends heavily on a small number of deals.",
        [
          `Largest deal concentration: ${round(concentration * 100)}%`,
          `Largest deal value: ${round(largestDeal)}`,
        ],
      );
    },
  };

const forecastAccuracySignal:
  PipelineHealthSignalDefinition = {
    key: "forecastAccuracy",
    label: "Forecast Accuracy",
    defaultWeight: 0.95,

    evaluate(context, weight) {
      const accuracy = normalizePercent(
        context.historicalForecastAccuracy,
      );

      if (accuracy === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          weight,
          "Historical forecast-accuracy evidence is unavailable.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        accuracy,
        weight,
        90,
        accuracy >= 75
          ? "Historical forecast performance supports pipeline reliability."
          : "Historical forecast variance reduces confidence in the pipeline.",
        [
          `Historical forecast accuracy: ${round(accuracy)}%`,
        ],
      );
    },
  };

export const pipelineHealthSignals:
  readonly PipelineHealthSignalDefinition[] = [
    coverageSignal,
    conversionQualitySignal,
    revenueConfidenceSignal,
    stageDistributionSignal,
    pipelineVelocitySignal,
    activityHealthSignal,
    closeDateStabilitySignal,
    riskConcentrationSignal,
    dealConcentrationSignal,
    forecastAccuracySignal,
  ];

export const createPipelineHealthSignals = (
  weightOverrides: Partial<
    Record<PipelineHealthSignalKey, number>
  > = {},
): readonly PipelineHealthSignalDefinition[] =>
  pipelineHealthSignals.map(
    (signal) => ({
      ...signal,
      defaultWeight:
        weightOverrides[signal.key]
        ?? signal.defaultWeight,
    }),
  );
