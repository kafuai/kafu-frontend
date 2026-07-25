import type {
  PipelineHealthContext,
  PipelineHealthOpportunityInput,
} from "./PipelineHealthTypes";

export type PipelineHealthSignalKey =
  | "coverage"
  | "conversionQuality"
  | "revenueConfidence"
  | "stageDistribution"
  | "pipelineVelocity"
  | "activityHealth"
  | "closeDateStability"
  | "riskConcentration"
  | "dealConcentration"
  | "forecastAccuracy";

export interface PipelineHealthSignalResult {
  key: PipelineHealthSignalKey;
  label: string;

  score: number;
  weight: number;
  weightedScore: number;
  confidence: number;

  available: boolean;
  reason: string;
  evidence: readonly string[];
}

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

const normalizePercent = (
  value: number | undefined,
): number | null => {
  if (
    value === undefined
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

const openOpportunities = (
  context: PipelineHealthContext,
): readonly PipelineHealthOpportunityInput[] =>
  context.opportunities.filter(
    (opportunity) =>
      opportunity.isOpen,
  );

const weightedAmount = (
  opportunity: PipelineHealthOpportunityInput,
): number => {
  if (
    opportunity.weightedAmount !== undefined
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
    normalizePercent(
      opportunity.winProbability
      ?? opportunity.stageProbability,
    ) ?? 0;

  return Math.max(
    0,
    opportunity.amount,
  ) * probability / 100;
};

const unavailable = (
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

const result = (
  key: PipelineHealthSignalKey,
  label: string,
  score: number,
  weight: number,
  confidence: number,
  reason: string,
  evidence: readonly string[],
): PipelineHealthSignalResult => {
  const normalizedScore =
    clamp(score);

  return {
    key,
    label,

    score:
      round(normalizedScore),

    weight,

    weightedScore:
      round(
        normalizedScore * weight,
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

const coverageSignal:
  PipelineHealthSignalDefinition = {
    key: "coverage",
    label: "Pipeline Coverage",
    defaultWeight: 0.15,

    evaluate(context, weight) {
      if (
        context.revenueTarget === undefined
        || context.revenueTarget <= 0
      ) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "Revenue target is unavailable.",
        );
      }

      const pipelineValue =
        openOpportunities(context)
          .reduce(
            (total, opportunity) =>
              total
              + Math.max(
                0,
                opportunity.amount,
              ),
            0,
          );

      const ratio =
        pipelineValue
        / context.revenueTarget;

      const score =
        clamp(
          ratio / 3 * 100,
        );

      return result(
        this.key,
        this.label,
        score,
        weight,
        100,
        ratio >= 3
          ? "Pipeline coverage is sufficient."
          : "Pipeline coverage requires attention.",
        [
          `Coverage ratio: ${round(ratio)}`,
          `Pipeline value: ${round(pipelineValue)}`,
          `Revenue target: ${round(context.revenueTarget)}`,
        ],
      );
    },
  };

const conversionQualitySignal:
  PipelineHealthSignalDefinition = {
    key: "conversionQuality",
    label: "Conversion Quality",
    defaultWeight: 0.12,

    evaluate(context, weight) {
      const probabilities =
        openOpportunities(context)
          .map(
            (opportunity) =>
              normalizePercent(
                opportunity.winProbability
                ?? opportunity.stageProbability,
              ),
          )
          .filter(
            (value): value is number =>
              value !== null,
          );

      const score =
        average(probabilities);

      if (score === null) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "Opportunity conversion probabilities are unavailable.",
        );
      }

      return result(
        this.key,
        this.label,
        score,
        weight,
        probabilities.length
          / Math.max(
            1,
            context.opportunities.length,
          )
          * 100,
        "Average opportunity probability represents conversion quality.",
        [
          `Average probability: ${round(score)}%`,
          `Evaluated opportunities: ${probabilities.length}`,
        ],
      );
    },
  };

const revenueConfidenceSignal:
  PipelineHealthSignalDefinition = {
    key: "revenueConfidence",
    label: "Revenue Confidence",
    defaultWeight: 0.12,

    evaluate(context, weight) {
      const open =
        openOpportunities(context);

      if (open.length === 0) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "No open opportunities are available.",
        );
      }

      const openValue =
        open.reduce(
          (total, opportunity) =>
            total
            + Math.max(
              0,
              opportunity.amount,
            ),
          0,
        );

      const weightedValue =
        open.reduce(
          (total, opportunity) =>
            total
            + weightedAmount(opportunity),
          0,
        );

      const score =
        openValue > 0
          ? weightedValue / openValue * 100
          : 0;

      return result(
        this.key,
        this.label,
        score,
        weight,
        90,
        "Weighted pipeline value represents forecast confidence.",
        [
          `Weighted value: ${round(weightedValue)}`,
          `Open value: ${round(openValue)}`,
        ],
      );
    },
  };

const stageDistributionSignal:
  PipelineHealthSignalDefinition = {
    key: "stageDistribution",
    label: "Stage Distribution",
    defaultWeight: 0.08,

    evaluate(context, weight) {
      const open =
        openOpportunities(context);

      if (open.length === 0) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "No open opportunities are available.",
        );
      }

      const stages =
        new Set(
          open.map(
            (opportunity) =>
              opportunity.stage,
          ),
        );

      const score =
        clamp(
          stages.size * 20,
        );

      return result(
        this.key,
        this.label,
        score,
        weight,
        80,
        stages.size >= 4
          ? "Pipeline opportunities are distributed across multiple stages."
          : "Pipeline stage distribution is concentrated.",
        [
          `Active stages: ${stages.size}`,
          `Open opportunities: ${open.length}`,
        ],
      );
    },
  };

const pipelineVelocitySignal:
  PipelineHealthSignalDefinition = {
    key: "pipelineVelocity",
    label: "Pipeline Velocity",
    defaultWeight: 0.11,

    evaluate(context, weight) {
      const values =
        openOpportunities(context)
          .map(
            (opportunity) =>
              opportunity.daysInStage,
          )
          .filter(
            (value): value is number =>
              value !== undefined
              && Number.isFinite(value)
              && value >= 0,
          );

      const days =
        average(values);

      if (days === null) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "Stage-duration evidence is unavailable.",
        );
      }

      const score =
        days <= 10
          ? 100
          : days <= 20
            ? 80
            : days <= 30
              ? 60
              : days <= 45
                ? 35
                : 10;

      return result(
        this.key,
        this.label,
        score,
        weight,
        values.length
          / Math.max(
            1,
            context.opportunities.length,
          )
          * 100,
        days <= 20
          ? "Pipeline stage velocity is healthy."
          : "Extended stage duration is slowing pipeline movement.",
        [
          `Average days in stage: ${round(days)}`,
        ],
      );
    },
  };

const activityHealthSignal:
  PipelineHealthSignalDefinition = {
    key: "activityHealth",
    label: "Activity Health",
    defaultWeight: 0.11,

    evaluate(context, weight) {
      const values =
        openOpportunities(context)
          .map(
            (opportunity) =>
              opportunity.daysSinceLastActivity,
          )
          .filter(
            (value): value is number =>
              value !== undefined
              && Number.isFinite(value)
              && value >= 0,
          );

      const inactivity =
        average(values);

      if (inactivity === null) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "Opportunity activity evidence is unavailable.",
        );
      }

      const score =
        inactivity <= 3
          ? 100
          : inactivity <= 7
            ? 85
            : inactivity <= 14
              ? 65
              : inactivity <= 30
                ? 35
                : 10;

      return result(
        this.key,
        this.label,
        score,
        weight,
        values.length
          / Math.max(
            1,
            context.opportunities.length,
          )
          * 100,
        inactivity <= 14
          ? "Pipeline activity remains healthy."
          : "Opportunity inactivity is weakening pipeline health.",
        [
          `Average inactivity days: ${round(inactivity)}`,
        ],
      );
    },
  };

const closeDateStabilitySignal:
  PipelineHealthSignalDefinition = {
    key: "closeDateStability",
    label: "Close-Date Stability",
    defaultWeight: 0.09,

    evaluate(context, weight) {
      const open =
        openOpportunities(context);

      if (open.length === 0) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "No open opportunities are available.",
        );
      }

      const validDates =
        open.filter(
          (opportunity) => {
            if (!opportunity.expectedCloseDate) {
              return false;
            }

            return !Number.isNaN(
              new Date(
                opportunity.expectedCloseDate,
              ).getTime(),
            );
          },
        ).length;

      const score =
        validDates / open.length * 100;

      return result(
        this.key,
        this.label,
        score,
        weight,
        90,
        score >= 80
          ? "Most opportunities have valid expected close dates."
          : "Missing or invalid close dates reduce pipeline reliability.",
        [
          `Valid close dates: ${validDates}`,
          `Open opportunities: ${open.length}`,
        ],
      );
    },
  };

const riskConcentrationSignal:
  PipelineHealthSignalDefinition = {
    key: "riskConcentration",
    label: "Risk Concentration",
    defaultWeight: 0.09,

    evaluate(context, weight) {
      const open =
        openOpportunities(context);

      if (open.length === 0) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "No open opportunities are available.",
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

      return result(
        this.key,
        this.label,
        100 - averageRisk,
        weight,
        90,
        averageRisk <= 35
          ? "Aggregate opportunity risk remains controlled."
          : "Risk concentration is weakening pipeline health.",
        [
          `Average risk: ${round(averageRisk)}%`,
        ],
      );
    },
  };

const dealConcentrationSignal:
  PipelineHealthSignalDefinition = {
    key: "dealConcentration",
    label: "Deal Concentration",
    defaultWeight: 0.07,

    evaluate(context, weight) {
      const open =
        openOpportunities(context);

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

      if (
        open.length === 0
        || totalValue <= 0
      ) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "Open pipeline value is unavailable.",
        );
      }

      const largestValue =
        Math.max(
          ...open.map(
            (opportunity) =>
              Math.max(
                0,
                opportunity.amount,
              ),
          ),
        );

      const concentration =
        largestValue / totalValue * 100;

      return result(
        this.key,
        this.label,
        100 - concentration,
        weight,
        100,
        concentration <= 35
          ? "Pipeline value is sufficiently diversified."
          : "Pipeline value is concentrated in a small number of deals.",
        [
          `Largest-deal concentration: ${round(concentration)}%`,
        ],
      );
    },
  };

const forecastAccuracySignal:
  PipelineHealthSignalDefinition = {
    key: "forecastAccuracy",
    label: "Forecast Alignment",
    defaultWeight: 0.06,

    evaluate(context, weight) {
      if (
        context.revenueForecast === undefined
        || context.revenueForecast < 0
      ) {
        return unavailable(
          this.key,
          this.label,
          weight,
          "Revenue forecast is unavailable.",
        );
      }

      const weightedPipeline =
        openOpportunities(context)
          .reduce(
            (total, opportunity) =>
              total
              + weightedAmount(opportunity),
            0,
          );

      const denominator =
        Math.max(
          1,
          context.revenueForecast,
          weightedPipeline,
        );

      const variance =
        Math.abs(
          context.revenueForecast
          - weightedPipeline,
        ) / denominator * 100;

      const score =
        100 - variance;

      return result(
        this.key,
        this.label,
        score,
        weight,
        90,
        variance <= 15
          ? "Revenue forecast aligns with weighted pipeline evidence."
          : "Revenue forecast materially differs from weighted pipeline evidence.",
        [
          `Forecast variance: ${round(variance)}%`,
          `Revenue forecast: ${round(context.revenueForecast)}`,
          `Weighted pipeline: ${round(weightedPipeline)}`,
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

export const evaluatePipelineHealthSignals = (
  context: PipelineHealthContext,
  weightOverrides: Partial<
    Record<PipelineHealthSignalKey, number>
  > = {},
): readonly PipelineHealthSignalResult[] =>
  createPipelineHealthSignals(
    weightOverrides,
  ).map(
    (signal) =>
      signal.evaluate(
        context,
        signal.defaultWeight,
      ),
  );
