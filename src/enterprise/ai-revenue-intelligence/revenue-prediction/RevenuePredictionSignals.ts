import type {
  RevenuePredictionContext,
  RevenuePredictionOpportunityInput,
  RevenuePredictionRiskLevel,
} from "./RevenuePredictionTypes";

export type RevenuePredictionSignalKey =
  | "pipelineValue"
  | "probabilityQuality"
  | "stageMaturity"
  | "closeDateReliability"
  | "activityMomentum"
  | "historicalPerformance"
  | "riskExposure"
  | "pipelineCommitment"
  | "targetCoverage"
  | "dataCompleteness";

export interface RevenuePredictionSignalResult {
  key: RevenuePredictionSignalKey;
  label: string;

  normalizedValue: number;
  coefficient: number;
  contribution: number;
  confidence: number;

  available: boolean;
  reason: string;
  evidence: readonly string[];
}

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
  Math.min(
    maximum,
    Math.max(minimum, value),
  );

const round = (
  value: number,
): number =>
  Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;

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

const average = (
  values: readonly number[],
): number | null => {
  if (values.length === 0) {
    return null;
  }

  return values.reduce(
    (total, value) =>
      total + value,
    0,
  ) / values.length;
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
  const value =
    clamp(normalizedValue);

  const centeredValue =
    (value - 50) / 50;

  return {
    key,
    label,

    normalizedValue:
      round(value),

    coefficient,

    contribution:
      round(
        centeredValue * coefficient,
      ),

    confidence:
      round(
        clamp(confidence),
      ),

    available: true,
    reason,
    evidence,
  };
};

const getOpenOpportunities = (
  context: RevenuePredictionContext,
): readonly RevenuePredictionOpportunityInput[] =>
  context.opportunities.filter(
    (opportunity) =>
      opportunity.isOpen,
  );

const resolveOpportunityProbability = (
  opportunity: RevenuePredictionOpportunityInput,
): number | null =>
  normalizePercent(
    opportunity.winProbability
    ?? opportunity.stageProbability
    ?? opportunity.historicalWinRate,
  );

const resolveRiskLevel = (
  opportunity: RevenuePredictionOpportunityInput,
): RevenuePredictionRiskLevel => {
  const risk =
    normalizePercent(
      opportunity.riskScore,
    ) ?? 30;

  if (risk >= 85) {
    return "critical";
  }

  if (risk >= 65) {
    return "high";
  }

  if (risk >= 40) {
    return "medium";
  }

  return "low";
};

const pipelineValueSignal:
  RevenuePredictionSignalDefinition = {
    key: "pipelineValue",
    label: "Pipeline Value Integrity",
    defaultCoefficient: 0.7,

    evaluate(context, coefficient) {
      const open =
        getOpenOpportunities(context);

      const totalValue =
        open.reduce(
          (total, opportunity) =>
            total
            + Math.max(
              0,
              opportunity.amount,
            ),
          0,
        );

      if (open.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "No open opportunities are available for the forecast period.",
        );
      }

      const validCount =
        open.filter(
          (opportunity) =>
            Number.isFinite(
              opportunity.amount,
            )
            && opportunity.amount > 0,
        ).length;

      return createSignal(
        this.key,
        this.label,
        validCount / open.length * 100,
        coefficient,
        100,
        "The signal measures commercial-value completeness across the open pipeline.",
        [
          `Open opportunities: ${open.length}`,
          `Valid-value opportunities: ${validCount}`,
          `Total open pipeline: ${round(totalValue)}`,
        ],
      );
    },
  };

const probabilityQualitySignal:
  RevenuePredictionSignalDefinition = {
    key: "probabilityQuality",
    label: "Probability Quality",
    defaultCoefficient: 1.25,

    evaluate(context, coefficient) {
      const probabilities =
        getOpenOpportunities(context)
          .map(
            resolveOpportunityProbability,
          )
          .filter(
            (value): value is number =>
              value !== null,
          );

      const probabilityAverage =
        average(probabilities);

      if (probabilityAverage === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "No calibrated opportunity probability is available.",
        );
      }

      const coverage =
        context.opportunities.length > 0
          ? probabilities.length
            / context.opportunities.length
            * 100
          : 0;

      return createSignal(
        this.key,
        this.label,
        probabilityAverage,
        coefficient,
        coverage,
        "Average calibrated probability represents the expected conversion quality of the pipeline.",
        [
          `Average probability: ${round(probabilityAverage)}%`,
          `Probability coverage: ${round(coverage)}%`,
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
      const probabilities =
        getOpenOpportunities(context)
          .map(
            (opportunity) =>
              normalizePercent(
                opportunity.stageProbability,
              ),
          )
          .filter(
            (value): value is number =>
              value !== null,
          );

      const maturity =
        average(probabilities);

      if (maturity === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Pipeline stage probabilities are unavailable.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        maturity,
        coefficient,
        probabilities.length
          / Math.max(
            1,
            context.opportunities.length,
          )
          * 100,
        "Pipeline stage maturity influences expected revenue realization.",
        [
          `Average stage probability: ${round(maturity)}%`,
          `Evaluated opportunities: ${probabilities.length}`,
        ],
      );
    },
  };

const closeDateReliabilitySignal:
  RevenuePredictionSignalDefinition = {
    key: "closeDateReliability",
    label: "Close-Date Reliability",
    defaultCoefficient: 0.8,

    evaluate(context, coefficient) {
      const open =
        getOpenOpportunities(context);

      if (open.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "No open opportunities are available.",
        );
      }

      const periodStart =
        new Date(context.periodStart);

      const periodEnd =
        new Date(context.periodEnd);

      const validCloseDates =
        open.filter(
          (opportunity) => {
            if (!opportunity.expectedCloseDate) {
              return false;
            }

            const closeDate =
              new Date(
                opportunity.expectedCloseDate,
              );

            return (
              !Number.isNaN(
                closeDate.getTime(),
              )
              && closeDate >= periodStart
              && closeDate <= periodEnd
            );
          },
        );

      const value =
        validCloseDates.length
        / open.length
        * 100;

      return createSignal(
        this.key,
        this.label,
        value,
        coefficient,
        90,
        value >= 75
          ? "Most open opportunities have credible close dates within the forecast period."
          : "Close-date gaps reduce revenue forecast reliability.",
        [
          `Open opportunities: ${open.length}`,
          `Valid in-period close dates: ${validCloseDates.length}`,
        ],
      );
    },
  };

const activityMomentumSignal:
  RevenuePredictionSignalDefinition = {
    key: "activityMomentum",
    label: "Activity Momentum",
    defaultCoefficient: 0.75,

    evaluate(context, coefficient) {
      const recencyScores =
        getOpenOpportunities(context)
          .map(
            (opportunity) =>
              opportunity.daysSinceLastActivity,
          )
          .filter(
            (value): value is number =>
              value !== undefined
              && Number.isFinite(value)
              && value >= 0,
          )
          .map(
            (days) =>
              days <= 3
                ? 100
                : days <= 7
                  ? 85
                  : days <= 14
                    ? 65
                    : days <= 30
                      ? 35
                      : 10,
          );

      const activityScore =
        average(recencyScores);

      if (activityScore === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Opportunity activity evidence is unavailable.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        activityScore,
        coefficient,
        recencyScores.length
          / Math.max(
            1,
            context.opportunities.length,
          )
          * 100,
        activityScore >= 65
          ? "Recent pipeline activity supports revenue realization."
          : "Pipeline inactivity is weakening forecast confidence.",
        [
          `Activity score: ${round(activityScore)}`,
          `Evaluated opportunities: ${recencyScores.length}`,
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
      const actuals =
        context.historicalActuals ?? [];

      if (actuals.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Historical revenue actuals are unavailable.",
        );
      }

      const attainmentValues =
        actuals
          .filter(
            (entry) =>
              entry.targetRevenue !== undefined
              && entry.targetRevenue > 0,
          )
          .map(
            (entry) =>
              clamp(
                entry.actualRevenue
                / (entry.targetRevenue ?? 1)
                * 100,
              ),
          );

      const attainment =
        average(attainmentValues);

      if (attainment === null) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "Historical targets are unavailable for attainment calibration.",
        );
      }

      return createSignal(
        this.key,
        this.label,
        attainment,
        coefficient,
        Math.min(
          100,
          actuals.length * 20,
        ),
        attainment >= 80
          ? "Historical revenue attainment supports the current forecast."
          : "Historical performance indicates lower revenue realization.",
        [
          `Historical periods: ${actuals.length}`,
          `Average attainment: ${round(attainment)}%`,
        ],
      );
    },
  };

const riskExposureSignal:
  RevenuePredictionSignalDefinition = {
    key: "riskExposure",
    label: "Risk Exposure",
    defaultCoefficient: 1,

    evaluate(context, coefficient) {
      const open =
        getOpenOpportunities(context);

      if (open.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "No open opportunities are available for risk analysis.",
        );
      }

      const riskScores =
        open.map(
          (opportunity) =>
            normalizePercent(
              opportunity.riskScore,
            ) ?? 30,
        );

      const averageRisk =
        average(riskScores) ?? 0;

      const criticalCount =
        open.filter(
          (opportunity) =>
            resolveRiskLevel(opportunity)
              === "critical",
        ).length;

      return createSignal(
        this.key,
        this.label,
        100 - averageRisk,
        coefficient,
        riskScores.length
          / open.length
          * 100,
        averageRisk <= 35
          ? "Aggregate pipeline risk remains controlled."
          : "Risk exposure is reducing expected revenue realization.",
        [
          `Average risk: ${round(averageRisk)}%`,
          `Critical-risk opportunities: ${criticalCount}`,
        ],
      );
    },
  };

const pipelineCommitmentSignal:
  RevenuePredictionSignalDefinition = {
    key: "pipelineCommitment",
    label: "Pipeline Commitment",
    defaultCoefficient: 0.9,

    evaluate(context, coefficient) {
      const open =
        getOpenOpportunities(context);

      if (open.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "No open opportunities are available.",
        );
      }

      const committedValue =
        open
          .filter(
            (opportunity) =>
              opportunity.committed
              || opportunity.pipelineCategory
                === "commit",
          )
          .reduce(
            (total, opportunity) =>
              total
              + Math.max(
                0,
                opportunity.amount,
              ),
            0,
          );

      const totalValue =
        open.reduce(
          (total, opportunity) =>
            total
            + Math.max(
              0,
              opportunity.amount,
            ),
          0,
        );

      const commitment =
        totalValue > 0
          ? committedValue / totalValue * 100
          : 0;

      return createSignal(
        this.key,
        this.label,
        commitment,
        coefficient,
        90,
        commitment >= 50
          ? "Committed opportunities materially support the base forecast."
          : "The forecast depends heavily on uncommitted pipeline.",
        [
          `Committed pipeline: ${round(committedValue)}`,
          `Total open pipeline: ${round(totalValue)}`,
        ],
      );
    },
  };

const targetCoverageSignal:
  RevenuePredictionSignalDefinition = {
    key: "targetCoverage",
    label: "Target Coverage",
    defaultCoefficient: 1,

    evaluate(context, coefficient) {
      if (
        context.revenueTarget === undefined
        || context.revenueTarget <= 0
      ) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "A positive revenue target is not configured.",
        );
      }

      const weightedPipeline =
        getOpenOpportunities(context)
          .reduce(
            (total, opportunity) => {
              const probability =
                resolveOpportunityProbability(
                  opportunity,
                ) ?? 0;

              return total
                + Math.max(
                  0,
                  opportunity.amount,
                )
                * probability
                / 100;
            },
            0,
          );

      const coverage =
        weightedPipeline
        / context.revenueTarget
        * 100;

      return createSignal(
        this.key,
        this.label,
        coverage,
        coefficient,
        90,
        coverage >= 100
          ? "Weighted pipeline covers the configured revenue target."
          : "Weighted pipeline remains below the configured revenue target.",
        [
          `Weighted pipeline: ${round(weightedPipeline)}`,
          `Revenue target: ${round(context.revenueTarget)}`,
          `Coverage: ${round(coverage)}%`,
        ],
      );
    },
  };

const dataCompletenessSignal:
  RevenuePredictionSignalDefinition = {
    key: "dataCompleteness",
    label: "Forecast Data Completeness",
    defaultCoefficient: 0.7,

    evaluate(context, coefficient) {
      const opportunities =
        context.opportunities;

      if (opportunities.length === 0) {
        return createUnavailableSignal(
          this.key,
          this.label,
          coefficient,
          "No opportunities are available for completeness analysis.",
        );
      }

      const scores =
        opportunities.map(
          (opportunity) => {
            const fields = [
              opportunity.amount > 0,
              Boolean(opportunity.stage),
              opportunity.stageProbability
                !== undefined,
              opportunity.winProbability
                !== undefined,
              Boolean(
                opportunity.expectedCloseDate,
              ),
              opportunity.daysSinceLastActivity
                !== undefined,
              opportunity.riskScore
                !== undefined,
              opportunity.momentumScore
                !== undefined,
            ];

            return fields.filter(Boolean).length
              / fields.length
              * 100;
          },
        );

      const completeness =
        average(scores) ?? 0;

      return createSignal(
        this.key,
        this.label,
        completeness,
        coefficient,
        100,
        completeness >= 75
          ? "Forecast source data is sufficiently complete."
          : "Missing opportunity evidence reduces forecast reliability.",
        [
          `Average completeness: ${round(completeness)}%`,
          `Evaluated opportunities: ${opportunities.length}`,
        ],
      );
    },
  };

export const revenuePredictionSignals:
  readonly RevenuePredictionSignalDefinition[] = [
    pipelineValueSignal,
    probabilityQualitySignal,
    stageMaturitySignal,
    closeDateReliabilitySignal,
    activityMomentumSignal,
    historicalPerformanceSignal,
    riskExposureSignal,
    pipelineCommitmentSignal,
    targetCoverageSignal,
    dataCompletenessSignal,
  ];

export const createRevenuePredictionSignals = (
  coefficientOverrides: Partial<
    Record<RevenuePredictionSignalKey, number>
  > = {},
): readonly RevenuePredictionSignalDefinition[] =>
  revenuePredictionSignals.map(
    (signal) => ({
      ...signal,

      defaultCoefficient:
        coefficientOverrides[signal.key]
        ?? signal.defaultCoefficient,
    }),
  );

export const evaluateRevenuePredictionSignals = (
  context: RevenuePredictionContext,
  coefficientOverrides: Partial<
    Record<RevenuePredictionSignalKey, number>
  > = {},
): readonly RevenuePredictionSignalResult[] =>
  createRevenuePredictionSignals(
    coefficientOverrides,
  ).map(
    (signal) =>
      signal.evaluate(
        context,
        signal.defaultCoefficient,
      ),
  );
