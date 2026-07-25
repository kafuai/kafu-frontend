import type {
  WinProbabilityTrend,
} from "../win-probability";
import type {
  SalesForecastContext,
  SalesForecastSignalKey,
  SalesForecastSignalResult,
} from "./SalesForecastTypes";

export interface SalesForecastSignalDefinition {
  key: SalesForecastSignalKey;
  label: string;
  defaultWeight: number;

  evaluate(
    context: SalesForecastContext,
    weight: number,
  ): SalesForecastSignalResult;
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

const createUnavailable = (
  key: SalesForecastSignalKey,
  label: string,
  weight: number,
  reason: string,
): SalesForecastSignalResult => ({
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
  key: SalesForecastSignalKey,
  label: string,
  score: number,
  weight: number,
  confidence: number,
  reason: string,
  evidence: readonly string[],
): SalesForecastSignalResult => ({
  key,
  label,

  score: round(clamp(score)),
  weight,

  weightedScore:
    round(clamp(score) * weight, 4),

  confidence:
    round(clamp(confidence)),

  available: true,

  reason,
  evidence,
});

const includedOpportunities = (
  context: SalesForecastContext,
) => {
  const periodStart =
    new Date(context.periodStart);

  const periodEnd =
    new Date(context.periodEnd);

  return context.opportunities.filter(
    (opportunity) => {
      if (
        opportunity.isClosed
        && opportunity.isWon
      ) {
        const actualCloseDate =
          opportunity.actualCloseDate
            ? new Date(
                opportunity.actualCloseDate,
              )
            : null;

        return Boolean(
          actualCloseDate
          && actualCloseDate >= periodStart
          && actualCloseDate <= periodEnd,
        );
      }

      if (!opportunity.expectedCloseDate) {
        return false;
      }

      const closeDate =
        new Date(
          opportunity.expectedCloseDate,
        );

      return (
        !Number.isNaN(closeDate.getTime())
        && closeDate >= periodStart
        && closeDate <= periodEnd
      );
    },
  );
};

const weightedPipelineSignal:
  SalesForecastSignalDefinition = {
    key: "weightedPipeline",
    label: "Weighted Pipeline Quality",
    defaultWeight: 1.15,

    evaluate(context, weight) {
      const opportunities =
        includedOpportunities(context);

      if (opportunities.length === 0) {
        return createUnavailable(
          this.key,
          this.label,
          weight,
          "No opportunities are included in the forecast period.",
        );
      }

      const pipelineValue =
        opportunities.reduce(
          (total, opportunity) =>
            total + opportunity.dealValue,
          0,
        );

      const predictedRevenue =
        opportunities.reduce(
          (total, opportunity) =>
            total
            + opportunity
              .revenuePrediction
              .expectedRevenue,
          0,
        );

      const realization =
        pipelineValue <= 0
          ? 0
          : predictedRevenue
            / pipelineValue;

      return createSignal(
        this.key,
        this.label,
        realization * 100,
        weight,
        90,
        realization >= 0.6
          ? "The included pipeline has strong predicted revenue realization."
          : "The included pipeline has weak predicted revenue realization.",
        [
          `Pipeline value: ${round(pipelineValue)}`,
          `Predicted revenue: ${round(predictedRevenue)}`,
          `Realization ratio: ${round(realization * 100)}%`,
        ],
      );
    },
  };

const commitCoverageSignal:
  SalesForecastSignalDefinition = {
    key: "commitCoverage",
    label: "Commit Coverage",
    defaultWeight: 1.2,

    evaluate(context, weight) {
      if (
        context.quota === null
        || context.quota === undefined
        || !Number.isFinite(context.quota)
        || context.quota <= 0
      ) {
        return createUnavailable(
          this.key,
          this.label,
          weight,
          "Quota is unavailable.",
        );
      }

      const commitRevenue =
        includedOpportunities(context)
          .filter(
            (opportunity) =>
              opportunity.forecastCategory
              === "commit"
              || (
                opportunity.isClosed
                && opportunity.isWon
              ),
          )
          .reduce(
            (total, opportunity) =>
              total
              + (
                opportunity.isClosed
                && opportunity.isWon
                  ? opportunity.dealValue
                  : opportunity
                      .revenuePrediction
                      .expectedRevenue
              ),
            0,
          );

      const coverage =
        commitRevenue / context.quota;

      return createSignal(
        this.key,
        this.label,
        clamp(coverage * 100),
        weight,
        95,
        coverage >= 1
          ? "Committed revenue covers the period quota."
          : "Committed revenue does not yet cover the period quota.",
        [
          `Commit revenue: ${round(commitRevenue)}`,
          `Quota: ${round(context.quota)}`,
          `Commit coverage: ${round(coverage * 100)}%`,
        ],
      );
    },
  };

const forecastRiskSignal:
  SalesForecastSignalDefinition = {
    key: "forecastRisk",
    label: "Forecast Risk",
    defaultWeight: 1.25,

    evaluate(context, weight) {
      const opportunities =
        includedOpportunities(context);

      if (opportunities.length === 0) {
        return createUnavailable(
          this.key,
          this.label,
          weight,
          "No risk evidence is available for the forecast period.",
        );
      }

      const atRisk =
        opportunities.filter(
          (opportunity) =>
            opportunity.dealRisk?.riskLevel
              === "high"
            || opportunity.dealRisk?.riskLevel
              === "critical"
            || opportunity.revenuePrediction
              .riskLevel === "high"
            || opportunity.revenuePrediction
              .riskLevel === "critical",
        );

      const atRiskRevenue =
        atRisk.reduce(
          (total, opportunity) =>
            total
            + opportunity
              .revenuePrediction
              .expectedRevenue,
          0,
        );

      const totalPredicted =
        opportunities.reduce(
          (total, opportunity) =>
            total
            + opportunity
              .revenuePrediction
              .expectedRevenue,
          0,
        );

      const riskRatio =
        totalPredicted <= 0
          ? 0
          : atRiskRevenue / totalPredicted;

      return createSignal(
        this.key,
        this.label,
        100 - riskRatio * 100,
        weight,
        90,
        riskRatio <= 0.25
          ? "Forecast revenue has limited high-risk exposure."
          : "A material portion of forecast revenue is exposed to high-risk opportunities.",
        [
          `At-risk opportunities: ${atRisk.length}`,
          `At-risk predicted revenue: ${round(atRiskRevenue)}`,
          `At-risk revenue ratio: ${round(riskRatio * 100)}%`,
        ],
      );
    },
  };

const pipelineConcentrationSignal:
  SalesForecastSignalDefinition = {
    key: "pipelineConcentration",
    label: "Pipeline Concentration",
    defaultWeight: 0.9,

    evaluate(context, weight) {
      const opportunities =
        includedOpportunities(context)
          .filter(
            (opportunity) =>
              opportunity.dealValue > 0,
          );

      if (opportunities.length === 0) {
        return createUnavailable(
          this.key,
          this.label,
          weight,
          "Pipeline concentration cannot be calculated.",
        );
      }

      const total =
        opportunities.reduce(
          (sum, opportunity) =>
            sum + opportunity.dealValue,
          0,
        );

      const largest =
        Math.max(
          ...opportunities.map(
            (opportunity) =>
              opportunity.dealValue,
          ),
        );

      const concentration =
        total <= 0
          ? 1
          : largest / total;

      return createSignal(
        this.key,
        this.label,
        100 - concentration * 100,
        weight,
        85,
        concentration <= 0.35
          ? "Forecast value is diversified across opportunities."
          : "Forecast value is concentrated in a small number of opportunities.",
        [
          `Largest opportunity share: ${round(concentration * 100)}%`,
          `Included opportunities: ${opportunities.length}`,
        ],
      );
    },
  };

const closeDateQualitySignal:
  SalesForecastSignalDefinition = {
    key: "closeDateQuality",
    label: "Close-Date Quality",
    defaultWeight: 1,

    evaluate(context, weight) {
      const openOpportunities =
        context.opportunities.filter(
          (opportunity) =>
            !opportunity.isClosed,
        );

      if (openOpportunities.length === 0) {
        return createUnavailable(
          this.key,
          this.label,
          weight,
          "No open opportunities are available.",
        );
      }

      const validCloseDates =
        openOpportunities.filter(
          (opportunity) => {
            if (
              !opportunity.expectedCloseDate
            ) {
              return false;
            }

            return !Number.isNaN(
              new Date(
                opportunity.expectedCloseDate,
              ).getTime(),
            );
          },
        ).length;

      const quality =
        validCloseDates
        / openOpportunities.length;

      return createSignal(
        this.key,
        this.label,
        quality * 100,
        weight,
        95,
        quality >= 0.9
          ? "Open opportunities have reliable close-date coverage."
          : "Some open opportunities have missing or invalid close dates.",
        [
          `Open opportunities: ${openOpportunities.length}`,
          `Valid close dates: ${validCloseDates}`,
          `Close-date coverage: ${round(quality * 100)}%`,
        ],
      );
    },
  };

const predictionConfidenceSignal:
  SalesForecastSignalDefinition = {
    key: "predictionConfidence",
    label: "Prediction Confidence",
    defaultWeight: 1.1,

    evaluate(context, weight) {
      const opportunities =
        includedOpportunities(context);

      if (opportunities.length === 0) {
        return createUnavailable(
          this.key,
          this.label,
          weight,
          "Prediction confidence is unavailable.",
        );
      }

      const weightedConfidence =
        opportunities.reduce(
          (total, opportunity) =>
            total
            + opportunity
              .revenuePrediction
              .confidenceScore
              * Math.max(
                  opportunity.dealValue,
                  1,
                ),
          0,
        );

      const totalValue =
        opportunities.reduce(
          (total, opportunity) =>
            total
            + Math.max(
                opportunity.dealValue,
                1,
              ),
          0,
        );

      const confidence =
        weightedConfidence / totalValue;

      return createSignal(
        this.key,
        this.label,
        confidence,
        weight,
        confidence,
        confidence >= 70
          ? "Revenue predictions have strong aggregate confidence."
          : "Revenue predictions have limited aggregate confidence.",
        [
          `Aggregate prediction confidence: ${round(confidence)}%`,
          `Included opportunities: ${opportunities.length}`,
        ],
      );
    },
  };

const dealMomentumSignal:
  SalesForecastSignalDefinition = {
    key: "dealMomentum",
    label: "Deal Momentum",
    defaultWeight: 1,

    evaluate(context, weight) {
      const opportunities =
        includedOpportunities(context);

      if (opportunities.length === 0) {
        return createUnavailable(
          this.key,
          this.label,
          weight,
          "Deal momentum cannot be calculated.",
        );
      }

      const momentumScores =
        opportunities.map(
          (opportunity) => {
            const trend:
              WinProbabilityTrend =
              opportunity
                .winProbability
                .trend;

            if (trend === "improving") {
              return 100;
            }

            if (trend === "declining") {
              return 20;
            }

            return 60;
          },
        );

      const score =
        momentumScores.reduce(
          (total, current) =>
            total + current,
          0,
        ) / momentumScores.length;

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        80,
        score >= 65
          ? "Opportunity momentum supports the forecast."
          : "Opportunity momentum is weakening forecast reliability.",
        [
          `Improving opportunities: ${
            opportunities.filter(
              (opportunity) =>
                opportunity
                  .winProbability
                  .trend === "improving",
            ).length
          }`,
          `Declining opportunities: ${
            opportunities.filter(
              (opportunity) =>
                opportunity
                  .winProbability
                  .trend === "declining",
            ).length
          }`,
        ],
      );
    },
  };

const historicalAttainmentSignal:
  SalesForecastSignalDefinition = {
    key: "historicalAttainment",
    label: "Historical Forecast Performance",
    defaultWeight: 0.85,

    evaluate(context, weight) {
      const history =
        context.historicalPerformance
          ?.filter(
            (entry) =>
              entry.forecastAccuracy
                !== undefined
              || entry.attainmentRate
                !== undefined,
          )
        ?? [];

      if (history.length === 0) {
        return createUnavailable(
          this.key,
          this.label,
          weight,
          "Historical forecast performance is unavailable.",
        );
      }

      const scores =
        history.map((entry) => {
          const accuracy =
            entry.forecastAccuracy
            ?? 50;

          const attainment =
            entry.attainmentRate
            ?? 50;

          return (
            clamp(accuracy) * 0.6
            + clamp(attainment) * 0.4
          );
        });

      const score =
        scores.reduce(
          (total, current) =>
            total + current,
          0,
        ) / scores.length;

      return createSignal(
        this.key,
        this.label,
        score,
        weight,
        75,
        score >= 70
          ? "Historical forecasting performance supports current confidence."
          : "Historical forecasting performance reduces current confidence.",
        [
          `Historical periods: ${history.length}`,
          `Historical performance score: ${round(score)}%`,
        ],
      );
    },
  };

export const salesForecastSignals:
  readonly SalesForecastSignalDefinition[] = [
    weightedPipelineSignal,
    commitCoverageSignal,
    forecastRiskSignal,
    pipelineConcentrationSignal,
    closeDateQualitySignal,
    predictionConfidenceSignal,
    dealMomentumSignal,
    historicalAttainmentSignal,
  ];

export const createSalesForecastSignals = (
  weightOverrides: Partial<
    Record<SalesForecastSignalKey, number>
  > = {},
): readonly SalesForecastSignalDefinition[] =>
  salesForecastSignals.map(
    (signal) => ({
      ...signal,

      defaultWeight:
        weightOverrides[signal.key]
        ?? signal.defaultWeight,
    }),
  );





