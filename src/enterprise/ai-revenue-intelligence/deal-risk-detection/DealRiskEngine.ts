import type {
  DealRiskAssessment,
  DealRiskBreakdown,
  DealRiskCategory,
  DealRiskCategorySummary,
  DealRiskConfiguration,
  DealRiskContext,
  DealRiskExplanation,
  DealRiskLevel,
  DealRiskSignalResult,
  DealRiskTrend,
} from "./DealRiskTypes";
import {
  createDealRiskSignals,
  type DealRiskSignalDefinition,
} from "./DealRiskSignals";

const DEFAULT_CONFIGURATION:
  DealRiskConfiguration = {
    modelVersion: "5.0.0",
    cacheTtlMs: 5 * 60 * 1000,
    minimumConfidence: 25,
    materialChangeThreshold: 5,
    immediateAttentionThreshold: 80,
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

const resolveRiskLevel = (
  riskScore: number,
): DealRiskLevel => {
  if (riskScore >= 80) {
    return "critical";
  }

  if (riskScore >= 60) {
    return "high";
  }

  if (riskScore >= 35) {
    return "moderate";
  }

  return "low";
};

const resolveTrend = (
  riskScore: number,
  previousRiskScore?: number | null,
): DealRiskTrend => {
  if (
    previousRiskScore === null
    || previousRiskScore === undefined
  ) {
    return "stable";
  }

  const delta =
    riskScore - previousRiskScore;

  if (delta >= 3) {
    return "worsening";
  }

  if (delta <= -3) {
    return "improving";
  }

  return "stable";
};

const calculateRiskScore = (
  signals: readonly DealRiskSignalResult[],
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
        + signal.riskScore
          * Math.abs(signal.weight),
      0,
    ) / totalWeight,
  );
};

const calculateConfidence = (
  signals: readonly DealRiskSignalResult[],
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

const buildCategorySummaries = (
  signals: readonly DealRiskSignalResult[],
): readonly DealRiskCategorySummary[] => {
  const categories: readonly DealRiskCategory[] = [
    "engagement",
    "activity",
    "stakeholder",
    "commercial",
    "timeline",
    "competition",
    "qualification",
    "forecast",
    "delivery",
    "concentration",
  ];

  return categories
    .map((category) => {
      const categorySignals =
        signals.filter(
          (signal) =>
            signal.category === category,
        );

      const available =
        categorySignals.filter(
          (signal) => signal.available,
        );

      const totalWeight =
        available.reduce(
          (total, signal) =>
            total
            + Math.abs(signal.weight),
          0,
        );

      const riskScore =
        totalWeight === 0
          ? 0
          : available.reduce(
              (total, signal) =>
                total
                + signal.riskScore
                  * Math.abs(signal.weight),
              0,
            ) / totalWeight;

      const primary =
        [...available].sort(
          (left, right) =>
            right.weightedRisk
            - left.weightedRisk,
        )[0];

      return {
        category,
        riskScore: round(riskScore),
        severity:
          resolveRiskLevel(riskScore),
        signalCount:
          categorySignals.length,
        availableSignalCount:
          available.length,
        primaryReason:
          primary?.reason,
      };
    })
    .filter(
      (summary) =>
        summary.signalCount > 0,
    );
};

const buildBreakdown = (
  signals: readonly DealRiskSignalResult[],
): DealRiskBreakdown => {
  const available =
    signals.filter(
      (signal) => signal.available,
    );

  const topRisks =
    [...available]
      .filter(
        (signal) =>
          signal.riskScore >= 35,
      )
      .sort(
        (left, right) =>
          right.weightedRisk
          - left.weightedRisk,
      )
      .slice(0, 6);

  const improvingSignals =
    [...available]
      .filter(
        (signal) =>
          signal.riskScore < 35,
      )
      .sort(
        (left, right) =>
          left.riskScore
          - right.riskScore,
      )
      .slice(0, 4);

  return {
    signals,
    categories:
      buildCategorySummaries(signals),

    availableSignals:
      available.length,

    totalSignals:
      signals.length,

    activeRiskCount:
      available.filter(
        (signal) =>
          signal.riskScore >= 35,
      ).length,

    highRiskCount:
      available.filter(
        (signal) =>
          signal.severity === "high",
      ).length,

    criticalRiskCount:
      available.filter(
        (signal) =>
          signal.severity === "critical",
      ).length,

    topRisks,
    improvingSignals,
  };
};

const buildExplanation = (
  riskScore: number,
  riskLevel: DealRiskLevel,
  breakdown: DealRiskBreakdown,
): DealRiskExplanation => {
  const primaryRisks =
    breakdown.topRisks.map(
      (signal) =>
        `${signal.label}: ${signal.reason}`,
    );

  const supportingEvidence =
    breakdown.topRisks.flatMap(
      (signal) =>
        signal.evidence.slice(0, 2),
    );

  const recommendedActions =
    breakdown.topRisks
      .map(
        (signal) =>
          signal.recommendedAction,
      )
      .filter(
        (action): action is string =>
          Boolean(action),
      );

  const summary =
    riskLevel === "low"
      ? `Deal risk is low at ${riskScore.toFixed(2)}.`
      : riskLevel === "moderate"
        ? `Deal risk is moderate at ${riskScore.toFixed(2)} and requires active monitoring.`
        : riskLevel === "high"
          ? `Deal risk is high at ${riskScore.toFixed(2)} and requires a recovery plan.`
          : `Deal risk is critical at ${riskScore.toFixed(2)} and requires immediate intervention.`;

  return {
    summary,
    primaryRisks,
    supportingEvidence,
    recommendedActions:
      recommendedActions.length > 0
        ? recommendedActions
        : [
            "Maintain opportunity momentum.",
            "Confirm the next customer commitment.",
            "Review risk signals during the next forecast cycle.",
          ],
  };
};

export class DealRiskEngine {
  private readonly configuration:
    DealRiskConfiguration;

  private readonly signals:
    readonly DealRiskSignalDefinition[];

  constructor(
    configuration: Partial<
      DealRiskConfiguration
    > = {},
    signals?: readonly DealRiskSignalDefinition[],
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
      ?? createDealRiskSignals(
        this.configuration.signalWeights,
      );
  }

  calculate(
    context: DealRiskContext,
    calculatedAt = new Date(),
  ): DealRiskAssessment {
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

    const riskScore =
      round(
        calculateRiskScore(
          signalResults,
        ),
      );

    const confidence =
      round(
        calculateConfidence(
          signalResults,
        ),
      );

    const riskLevel =
      resolveRiskLevel(riskScore);

    const breakdown =
      buildBreakdown(
        signalResults,
      );

    return {
      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      opportunityId:
        context.opportunityId,

      currency:
        context.currency,

      dealValue:
        round(context.dealValue),

      riskScore,
      riskLevel,
      confidence,

      trend:
        resolveTrend(
          riskScore,
          context.previousRiskScore,
        ),

      activeRiskCount:
        breakdown.activeRiskCount,

      highRiskCount:
        breakdown.highRiskCount,

      criticalRiskCount:
        breakdown.criticalRiskCount,

      immediateAttentionRequired:
        riskScore
          >= this.configuration
            .immediateAttentionThreshold
        || breakdown.criticalRiskCount > 0,

      breakdown,

      explanation:
        buildExplanation(
          riskScore,
          riskLevel,
          breakdown,
        ),

      modelVersion:
        this.configuration.modelVersion,

      calculatedAt:
        calculatedAt.toISOString(),

      sourceOpportunityScoreCalculatedAt:
        context.opportunityScore.calculatedAt,

      sourceWinProbabilityCalculatedAt:
        context.winProbability.calculatedAt,

      sourceRevenuePredictionCalculatedAt:
        context.revenuePrediction
          ?.calculatedAt,

      metadata: {
        accountId:
          context.accountId,

        ownerId:
          context.ownerId,

        stage:
          context.stage,

        opportunityScore:
          context.opportunityScore.score,

        opportunityRisk:
          context.opportunityScore.riskLevel,

        winProbability:
          context.winProbability.probability,

        revenuePrediction:
          context.revenuePrediction
            ?.predictedRevenue,
      },
    };
  }

  private validateContext(
    context: DealRiskContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Deal risk detection requires a tenantId.",
      );
    }

    if (!context.opportunityId.trim()) {
      throw new Error(
        "Deal risk detection requires an opportunityId.",
      );
    }

    if (!context.currency.trim()) {
      throw new Error(
        "Deal risk detection requires a currency.",
      );
    }

    if (
      !Number.isFinite(context.dealValue)
      || context.dealValue < 0
    ) {
      throw new Error(
        "Deal risk detection requires a valid deal value.",
      );
    }

    if (
      context.opportunityScore.tenantId
      !== context.tenantId
      || context.winProbability.tenantId
      !== context.tenantId
    ) {
      throw new Error(
        "Deal risk sources do not match the tenant.",
      );
    }

    if (
      context.opportunityScore.opportunityId
      !== context.opportunityId
      || context.winProbability.opportunityId
      !== context.opportunityId
    ) {
      throw new Error(
        "Deal risk sources do not match the opportunity.",
      );
    }

    if (
      context.revenuePrediction
      && (
        context.revenuePrediction.tenantId
          !== context.tenantId
        || context.revenuePrediction
          .opportunityId
          !== context.opportunityId
      )
    ) {
      throw new Error(
        "Revenue prediction does not match the deal-risk scope.",
      );
    }
  }
}

export const createDealRiskEngine = (
  configuration: Partial<
    DealRiskConfiguration
  > = {},
): DealRiskEngine =>
  new DealRiskEngine(
    configuration,
  );
