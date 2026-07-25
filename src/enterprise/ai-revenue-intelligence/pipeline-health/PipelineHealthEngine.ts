import type {
  PipelineHealthAssessment,
  PipelineHealthBreakdown,
  PipelineHealthConfiguration,
  PipelineHealthContext,
  PipelineHealthExplanation,
  PipelineHealthLevel,
  PipelineHealthRiskDistribution,
  PipelineHealthSignalResult,
  PipelineHealthStageDistribution,
  PipelineHealthTrend,
} from "./PipelineHealthTypes";
import {
  createPipelineHealthSignals,
  type PipelineHealthSignalDefinition,
} from "./PipelineHealthSignals";

const DEFAULT_CONFIGURATION:
  PipelineHealthConfiguration = {
    modelVersion: "5.0.0",
    cacheTtlMs: 5 * 60 * 1000,
    minimumConfidence: 25,
    materialChangeThreshold: 5,
  };

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

const resolveHealthLevel = (
  healthScore: number,
): PipelineHealthLevel => {
  if (healthScore >= 85) {
    return "excellent";
  }

  if (healthScore >= 70) {
    return "healthy";
  }

  if (healthScore >= 50) {
    return "watch";
  }

  if (healthScore >= 30) {
    return "at-risk";
  }

  return "critical";
};

const resolveTrend = (
  healthScore: number,
  previousHealthScore?: number | null,
): PipelineHealthTrend => {
  if (
    previousHealthScore === null
    || previousHealthScore === undefined
  ) {
    return "stable";
  }

  const delta =
    healthScore - previousHealthScore;

  if (delta >= 3) {
    return "improving";
  }

  if (delta <= -3) {
    return "declining";
  }

  return "stable";
};

const calculateConfidence = (
  signals: readonly PipelineHealthSignalResult[],
): number => {
  const available =
    signals.filter(
      (signal) => signal.available,
    );

  if (available.length === 0) {
    return 0;
  }

  const averageConfidence =
    available.reduce(
      (total, signal) =>
        total + signal.confidence,
      0,
    ) / available.length;

  const coverage =
    (
      available.length
      / signals.length
    ) * 100;

  return clamp(
    averageConfidence * 0.7
    + coverage * 0.3,
  );
};

const calculateHealthScore = (
  signals: readonly PipelineHealthSignalResult[],
): number => {
  const available =
    signals.filter(
      (signal) => signal.available,
    );

  const totalWeight =
    available.reduce(
      (total, signal) =>
        total + Math.abs(signal.weight),
      0,
    );

  if (totalWeight === 0) {
    return 0;
  }

  return clamp(
    available.reduce(
      (total, signal) =>
        total
        + signal.score
          * Math.abs(signal.weight),
      0,
    ) / totalWeight,
  );
};

const buildStageDistribution = (
  context: PipelineHealthContext,
  totalValue: number,
): readonly PipelineHealthStageDistribution[] => {
  const grouped =
    context.opportunities.reduce<
      Record<
        string,
        {
          opportunityCount: number;
          totalValue: number;
          weightedRevenue: number;
        }
      >
    >((result, opportunity) => {
      const stage =
        opportunity.stage?.trim()
        || "unknown";

      const current =
        result[stage]
        ?? {
          opportunityCount: 0,
          totalValue: 0,
          weightedRevenue: 0,
        };

      current.opportunityCount += 1;
      current.totalValue +=
        Math.max(
          0,
          opportunity.dealValue,
        );

      current.weightedRevenue +=
        opportunity.revenuePrediction
          ?.weightedRevenue
        ?? (
          opportunity.dealValue
          * (
            (
              opportunity.winProbability
                ?.probability
              ?? 0
            ) / 100
          )
        );

      result[stage] = current;

      return result;
    }, {});

  return Object.entries(grouped)
    .map(
      ([stage, value]) => ({
        stage,
        opportunityCount:
          value.opportunityCount,
        totalValue:
          round(value.totalValue),
        weightedRevenue:
          round(value.weightedRevenue),
        percentageOfValue:
          totalValue === 0
            ? 0
            : round(
                (
                  value.totalValue
                  / totalValue
                ) * 100,
              ),
      }),
    )
    .sort(
      (left, right) =>
        right.totalValue
        - left.totalValue,
    );
};

const buildRiskDistribution = (
  context: PipelineHealthContext,
  totalValue: number,
): readonly PipelineHealthRiskDistribution[] => {
  const riskLevels = [
    "low",
    "moderate",
    "high",
    "critical",
  ] as const;

  return riskLevels.map(
    (riskLevel) => {
      const opportunities =
        context.opportunities.filter(
          (opportunity) =>
            opportunity.riskLevel
            === riskLevel,
        );

      const riskValue =
        opportunities.reduce(
          (total, opportunity) =>
            total
            + Math.max(
                0,
                opportunity.dealValue,
              ),
          0,
        );

      return {
        riskLevel,
        opportunityCount:
          opportunities.length,
        totalValue:
          round(riskValue),
        percentageOfValue:
          totalValue === 0
            ? 0
            : round(
                (
                  riskValue
                  / totalValue
                ) * 100,
              ),
      };
    },
  );
};

const buildBreakdown = (
  context: PipelineHealthContext,
  signals: readonly PipelineHealthSignalResult[],
): PipelineHealthBreakdown => {
  const available =
    signals.filter(
      (signal) => signal.available,
    );

  const totalPipelineValue =
    context.opportunities.reduce(
      (total, opportunity) =>
        total
        + Math.max(
            0,
            opportunity.dealValue,
          ),
      0,
    );

  const totalWeightedRevenue =
    context.opportunities.reduce(
      (total, opportunity) =>
        total
        + (
          opportunity.revenuePrediction
            ?.weightedRevenue
          ?? (
            opportunity.dealValue
            * (
              (
                opportunity.winProbability
                  ?.probability
                ?? 0
              ) / 100
            )
          )
        ),
      0,
    );

  const totalPredictedRevenue =
    context.opportunities.reduce(
      (total, opportunity) =>
        total
        + (
          opportunity.revenuePrediction
            ?.predictedRevenue
          ?? 0
        ),
      0,
    );

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

  const scores =
    context.opportunities
      .map(
        (opportunity) =>
          opportunity.opportunityScore,
      )
      .filter(
        (value): value is number =>
          value !== null
          && value !== undefined
          && Number.isFinite(value),
      );

  const positiveSignals =
    [...available]
      .filter(
        (signal) => signal.score >= 70,
      )
      .sort(
        (left, right) =>
          right.weightedScore
          - left.weightedScore,
      )
      .slice(0, 4);

  const negativeSignals =
    [...available]
      .filter(
        (signal) => signal.score < 50,
      )
      .sort(
        (left, right) =>
          left.score - right.score,
      )
      .slice(0, 4);

  return {
    signals,

    availableSignals: available.length,
    totalSignals: signals.length,

    totalPipelineValue:
      round(totalPipelineValue),

    totalWeightedRevenue:
      round(totalWeightedRevenue),

    totalPredictedRevenue:
      round(totalPredictedRevenue),

    targetCoverageRatio:
      context.targetRevenue
      && context.targetRevenue > 0
        ? round(
            totalPipelineValue
            / context.targetRevenue,
            3,
          )
        : undefined,

    averageWinProbability:
      probabilities.length === 0
        ? 0
        : round(
            probabilities.reduce(
              (total, value) =>
                total + value,
              0,
            ) / probabilities.length,
          ),

    averageOpportunityScore:
      scores.length === 0
        ? 0
        : round(
            scores.reduce(
              (total, value) =>
                total + value,
              0,
            ) / scores.length,
          ),

    stageDistribution:
      buildStageDistribution(
        context,
        totalPipelineValue,
      ),

    riskDistribution:
      buildRiskDistribution(
        context,
        totalPipelineValue,
      ),

    positiveSignals,
    negativeSignals,
  };
};

const buildExplanation = (
  healthScore: number,
  healthLevel: PipelineHealthLevel,
  breakdown: PipelineHealthBreakdown,
): PipelineHealthExplanation => {
  const strengths =
    breakdown.positiveSignals.map(
      (signal) =>
        `${signal.label}: ${signal.reason}`,
    );

  const risks =
    breakdown.negativeSignals.map(
      (signal) =>
        `${signal.label}: ${signal.reason}`,
    );

  const recommendedActions =
    breakdown.negativeSignals.length > 0
      ? breakdown.negativeSignals.map(
          (signal) =>
            `Address ${signal.label.toLowerCase()} and assign a measurable recovery action.`,
        )
      : [
          "Protect current pipeline momentum.",
          "Maintain opportunity activity cadence.",
          "Review forecast changes weekly.",
        ];

  const summary =
    healthLevel === "excellent"
      ? `Pipeline health is excellent at ${healthScore.toFixed(2)}.`
      : healthLevel === "healthy"
        ? `Pipeline health is strong at ${healthScore.toFixed(2)}.`
        : healthLevel === "watch"
          ? `Pipeline health is mixed at ${healthScore.toFixed(2)} and requires focused monitoring.`
          : healthLevel === "at-risk"
            ? `Pipeline health is at risk at ${healthScore.toFixed(2)}.`
            : `Pipeline health is critical at ${healthScore.toFixed(2)} and requires immediate intervention.`;

  return {
    summary,
    strengths,
    risks,
    recommendedActions,
  };
};

export class PipelineHealthEngine {
  private readonly configuration:
    PipelineHealthConfiguration;

  private readonly signals:
    readonly PipelineHealthSignalDefinition[];

  constructor(
    configuration: Partial<
      PipelineHealthConfiguration
    > = {},
    signals?: readonly PipelineHealthSignalDefinition[],
  ) {
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...configuration,
      signalWeights: {
        ...DEFAULT_CONFIGURATION.signalWeights,
        ...configuration.signalWeights,
      },
    };

    this.signals =
      signals
      ?? createPipelineHealthSignals(
        this.configuration.signalWeights,
      );
  }

  calculate(
    context: PipelineHealthContext,
    calculatedAt = new Date(),
  ): PipelineHealthAssessment {
    this.validateContext(context);

    const signalResults =
      this.signals.map((signal) => {
        const weight =
          this.configuration
            .signalWeights?.[signal.key]
          ?? signal.defaultWeight;

        return signal.evaluate(
          context,
          weight,
        );
      });

    const healthScore =
      round(
        calculateHealthScore(
          signalResults,
        ),
      );

    const confidence =
      round(
        calculateConfidence(
          signalResults,
        ),
      );

    const healthLevel =
      resolveHealthLevel(
        healthScore,
      );

    const breakdown =
      buildBreakdown(
        context,
        signalResults,
      );

    const atRiskOpportunityCount =
      context.opportunities.filter(
        (opportunity) =>
          opportunity.riskLevel === "high",
      ).length;

    const criticalOpportunityCount =
      context.opportunities.filter(
        (opportunity) =>
          opportunity.riskLevel
          === "critical",
      ).length;

    return {
      tenantId: context.tenantId,
      workspaceId:
        context.workspaceId,
      pipelineId:
        context.pipelineId,

      currency: context.currency,

      healthScore,
      healthLevel,
      confidence,
      trend: resolveTrend(
        healthScore,
        context.previousHealthScore,
      ),

      totalPipelineValue:
        breakdown.totalPipelineValue,

      weightedRevenue:
        breakdown.totalWeightedRevenue,

      predictedRevenue:
        breakdown.totalPredictedRevenue,

      opportunityCount:
        context.opportunities.length,

      atRiskOpportunityCount,
      criticalOpportunityCount,

      periodStart:
        context.periodStart,

      periodEnd:
        context.periodEnd,

      breakdown,

      explanation:
        buildExplanation(
          healthScore,
          healthLevel,
          breakdown,
        ),

      modelVersion:
        this.configuration.modelVersion,

      calculatedAt:
        calculatedAt.toISOString(),

      metadata: {
        targetRevenue:
          context.targetRevenue,
        targetCoverageRatio:
          breakdown.targetCoverageRatio,
        averageWinProbability:
          breakdown.averageWinProbability,
        averageOpportunityScore:
          breakdown.averageOpportunityScore,
      },
    };
  }

  private validateContext(
    context: PipelineHealthContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Pipeline health requires a tenantId.",
      );
    }

    if (!context.currency.trim()) {
      throw new Error(
        "Pipeline health requires a currency.",
      );
    }

    const periodStart =
      new Date(context.periodStart);

    const periodEnd =
      new Date(context.periodEnd);

    if (
      Number.isNaN(periodStart.getTime())
      || Number.isNaN(periodEnd.getTime())
    ) {
      throw new Error(
        "Pipeline health requires valid period dates.",
      );
    }

    if (
      periodStart.getTime()
      > periodEnd.getTime()
    ) {
      throw new Error(
        "Pipeline health periodStart must be before periodEnd.",
      );
    }

    for (
      const opportunity
      of context.opportunities
    ) {
      if (
        !opportunity.opportunityId.trim()
      ) {
        throw new Error(
          "Every pipeline opportunity requires an opportunityId.",
        );
      }

      if (
        opportunity.currency
        !== context.currency
      ) {
        throw new Error(
          "Pipeline health does not support mixed currencies in one assessment.",
        );
      }

      if (
        !Number.isFinite(
          opportunity.dealValue,
        )
        || opportunity.dealValue < 0
      ) {
        throw new Error(
          `Opportunity ${opportunity.opportunityId} has an invalid deal value.`,
        );
      }
    }
  }
}

export const createPipelineHealthEngine = (
  configuration: Partial<
    PipelineHealthConfiguration
  > = {},
): PipelineHealthEngine =>
  new PipelineHealthEngine(
    configuration,
  );
