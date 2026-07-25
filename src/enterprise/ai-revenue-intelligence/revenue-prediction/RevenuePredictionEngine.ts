import type {
  RevenuePrediction,
  RevenuePredictionBreakdown,
  RevenuePredictionConfidenceBand,
  RevenuePredictionConfiguration,
  RevenuePredictionContext,
  RevenuePredictionExplanation,
  RevenuePredictionHorizon,
  RevenuePredictionRisk,
  RevenuePredictionSignalResult,
} from "./RevenuePredictionTypes";
import {
  createRevenuePredictionSignals,
  type RevenuePredictionSignalDefinition,
} from "./RevenuePredictionSignals";

const DEFAULT_CONFIGURATION: RevenuePredictionConfiguration = {
  modelVersion: "5.0.0",
  materialChangeThresholdPercent: 5,
  cacheTtlMs: 5 * 60 * 1000,
  minimumConfidence: 25,
  defaultHorizon: "current-quarter",
  minimumAdjustmentMultiplier: 0.75,
  maximumAdjustmentMultiplier: 1.2,
};

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number =>
  Math.min(maximum, Math.max(minimum, value));

const clampPercent = (value: number): number =>
  clamp(value, 0, 100);

const roundMoney = (value: number): number =>
  Math.round(value * 100) / 100;

const roundPercent = (value: number): number =>
  Math.round(value * 100) / 100;

const resolveConfidenceBand = (
  confidence: number,
): RevenuePredictionConfidenceBand => {
  if (confidence >= 85) {
    return "very-high";
  }

  if (confidence >= 70) {
    return "high";
  }

  if (confidence >= 45) {
    return "moderate";
  }

  return "low";
};

const resolveRiskLevel = (
  confidence: number,
  probability: number,
  opportunityRisk: string,
): RevenuePredictionRisk => {
  if (
    confidence < 35
    || probability < 20
    || opportunityRisk === "critical"
  ) {
    return "critical";
  }

  if (
    confidence < 50
    || probability < 40
    || opportunityRisk === "high"
  ) {
    return "high";
  }

  if (
    confidence < 70
    || probability < 65
    || opportunityRisk === "moderate"
  ) {
    return "moderate";
  }

  return "low";
};

const calculateConfidence = (
  signals: readonly RevenuePredictionSignalResult[],
  sourceConfidence: number,
): number => {
  const available = signals.filter(
    (signal) => signal.available,
  );

  if (available.length === 0) {
    return clampPercent(sourceConfidence * 0.5);
  }

  const averageConfidence =
    available.reduce(
      (total, signal) => total + signal.confidence,
      0,
    ) / available.length;

  const coverage =
    (available.length / signals.length) * 100;

  return clampPercent(
    averageConfidence * 0.45
    + coverage * 0.25
    + sourceConfidence * 0.3,
  );
};

const buildBreakdown = (
  signals: readonly RevenuePredictionSignalResult[],
  baseWeightedRevenue: number,
  minimumMultiplier: number,
  maximumMultiplier: number,
): RevenuePredictionBreakdown => {
  const available = signals.filter(
    (signal) => signal.available,
  );

  const totalCoefficient = available.reduce(
    (total, signal) =>
      total + Math.abs(signal.coefficient),
    0,
  );

  const weightedContribution =
    totalCoefficient === 0
      ? 0
      : available.reduce(
          (total, signal) =>
            total
            + signal.contribution
              * Math.abs(signal.coefficient),
          0,
        ) / totalCoefficient;

  const adjustmentMultiplier = clamp(
    1 + weightedContribution * 0.12,
    minimumMultiplier,
    maximumMultiplier,
  );

  const adjustedRevenue =
    baseWeightedRevenue * adjustmentMultiplier;

  const positiveSignals = [...available]
    .filter((signal) => signal.contribution > 0)
    .sort(
      (left, right) =>
        right.contribution - left.contribution,
    )
    .slice(0, 4);

  const negativeSignals = [...available]
    .filter((signal) => signal.contribution < 0)
    .sort(
      (left, right) =>
        left.contribution - right.contribution,
    )
    .slice(0, 4);

  return {
    signals,
    availableSignals: available.length,
    totalSignals: signals.length,
    baseWeightedRevenue:
      roundMoney(baseWeightedRevenue),
    adjustmentMultiplier:
      Math.round(adjustmentMultiplier * 10000)
      / 10000,
    adjustedRevenue:
      roundMoney(adjustedRevenue),
    positiveSignals,
    negativeSignals,
  };
};

const buildExplanation = (
  prediction: number,
  riskLevel: RevenuePredictionRisk,
  breakdown: RevenuePredictionBreakdown,
  currency: string,
): RevenuePredictionExplanation => {
  const primaryDrivers = breakdown.positiveSignals.map(
    (signal) => `${signal.label}: ${signal.reason}`,
  );

  const primaryRisks = breakdown.negativeSignals.map(
    (signal) => `${signal.label}: ${signal.reason}`,
  );

  const recommendedActions =
    breakdown.negativeSignals.length > 0
      ? breakdown.negativeSignals.map(
          (signal) =>
            `Improve ${signal.label.toLowerCase()} and validate the supporting commercial evidence.`,
        )
      : [
          "Protect the current sales momentum.",
          "Validate the next customer commitment.",
          "Confirm the expected close date and commercial terms.",
        ];

  const summary =
    riskLevel === "low"
      ? `Expected revenue is ${prediction.toFixed(2)} ${currency} with controlled forecast risk.`
      : riskLevel === "moderate"
        ? `Expected revenue is ${prediction.toFixed(2)} ${currency}, with moderate forecast uncertainty.`
        : riskLevel === "high"
          ? `Expected revenue is ${prediction.toFixed(2)} ${currency}, but material forecast risk remains.`
          : `Expected revenue is ${prediction.toFixed(2)} ${currency}, with critical reliability concerns.`;

  return {
    summary,
    primaryDrivers,
    primaryRisks,
    recommendedActions,
  };
};

export class RevenuePredictionEngine {
  private readonly configuration:
    RevenuePredictionConfiguration;

  private readonly signals:
    readonly RevenuePredictionSignalDefinition[];

  constructor(
    configuration: Partial<
      RevenuePredictionConfiguration
    > = {},
    signals?: readonly RevenuePredictionSignalDefinition[],
  ) {
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...configuration,
      signalCoefficients: {
        ...DEFAULT_CONFIGURATION.signalCoefficients,
        ...configuration.signalCoefficients,
      },
    };

    this.signals =
      signals
      ?? createRevenuePredictionSignals(
        this.configuration.signalCoefficients,
      );
  }

  calculate(
    context: RevenuePredictionContext,
    horizon: RevenuePredictionHorizon =
      this.configuration.defaultHorizon,
    calculatedAt = new Date(),
  ): RevenuePrediction {
    this.validateContext(context);

    const signalResults = this.signals.map(
      (signal) => {
        const coefficient =
          this.configuration
            .signalCoefficients?.[signal.key]
          ?? signal.defaultCoefficient;

        return signal.evaluate(
          context,
          coefficient,
        );
      },
    );

    const probability =
      context.winProbability.probability;

    const baseWeightedRevenue =
      context.dealValue * (probability / 100);

    const breakdown = buildBreakdown(
      signalResults,
      baseWeightedRevenue,
      this.configuration
        .minimumAdjustmentMultiplier,
      this.configuration
        .maximumAdjustmentMultiplier,
    );

    const sourceConfidence =
      (
        context.opportunityScore.confidence
        + context.winProbability.confidence
      ) / 2;

    const confidence = roundPercent(
      calculateConfidence(
        signalResults,
        sourceConfidence,
      ),
    );

    const predictedRevenue = roundMoney(
      Math.min(
        context.dealValue,
        Math.max(0, breakdown.adjustedRevenue),
      ),
    );

    const riskLevel = resolveRiskLevel(
      confidence,
      probability,
      context.opportunityScore.riskLevel,
    );

    const confidenceSpread =
      0.08
      + ((100 - confidence) / 100) * 0.22;

    const conservativeRevenue = roundMoney(
      Math.max(
        0,
        predictedRevenue * (1 - confidenceSpread),
      ),
    );

    const optimisticRevenue = roundMoney(
      Math.min(
        context.dealValue,
        predictedRevenue * (1 + confidenceSpread),
      ),
    );

    return {
      tenantId: context.tenantId,
      workspaceId: context.workspaceId,
      opportunityId: context.opportunityId,

      currency: context.currency,
      dealValue: roundMoney(context.dealValue),

      predictedRevenue,
      weightedRevenue:
        roundMoney(baseWeightedRevenue),

      optimisticRevenue,
      expectedRevenue: predictedRevenue,
      conservativeRevenue,

      confidence,
      confidenceBand:
        resolveConfidenceBand(confidence),
      riskLevel,
      horizon,

      breakdown,
      explanation: buildExplanation(
        predictedRevenue,
        riskLevel,
        breakdown,
        context.currency,
      ),

      modelVersion:
        this.configuration.modelVersion,
      calculatedAt: calculatedAt.toISOString(),

      sourceOpportunityScoreCalculatedAt:
        context.opportunityScore.calculatedAt,
      sourceWinProbabilityCalculatedAt:
        context.winProbability.calculatedAt,

      metadata: {
        accountId: context.accountId,
        ownerId: context.ownerId,
        stage: context.stage,
        winProbability:
          context.winProbability.probability,
        opportunityScore:
          context.opportunityScore.score,
      },
    };
  }

  private validateContext(
    context: RevenuePredictionContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Revenue prediction requires a tenantId.",
      );
    }

    if (!context.opportunityId.trim()) {
      throw new Error(
        "Revenue prediction requires an opportunityId.",
      );
    }

    if (!context.currency.trim()) {
      throw new Error(
        "Revenue prediction requires a currency.",
      );
    }

    if (
      !Number.isFinite(context.dealValue)
      || context.dealValue <= 0
    ) {
      throw new Error(
        "Revenue prediction requires a positive deal value.",
      );
    }

    if (
      context.opportunityScore.tenantId
      !== context.tenantId
      || context.winProbability.tenantId
      !== context.tenantId
    ) {
      throw new Error(
        "Revenue prediction sources do not match the tenant.",
      );
    }

    if (
      context.opportunityScore.opportunityId
      !== context.opportunityId
      || context.winProbability.opportunityId
      !== context.opportunityId
    ) {
      throw new Error(
        "Revenue prediction sources do not match the opportunity.",
      );
    }
  }
}

export const createRevenuePredictionEngine = (
  configuration: Partial<
    RevenuePredictionConfiguration
  > = {},
): RevenuePredictionEngine =>
  new RevenuePredictionEngine(configuration);
