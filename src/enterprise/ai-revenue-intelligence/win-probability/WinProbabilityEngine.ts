import {
  WinProbabilityBand,
  WinProbabilityBreakdown,
  WinProbabilityConfiguration,
  WinProbabilityContext,
  WinProbabilityExplanation,
  WinProbabilityPrediction,
  WinProbabilitySignalResult,
  WinProbabilityTrend,
} from "./WinProbabilityTypes";
import {
  createWinProbabilitySignals,
  WinProbabilitySignalDefinition,
} from "./WinProbabilitySignals";

const DEFAULT_CONFIGURATION: WinProbabilityConfiguration = {
  modelVersion: "5.0.0",
  materialChangeThreshold: 5,
  cacheTtlMs: 5 * 60 * 1000,
  minimumConfidence: 25,
  intercept: 0,
};

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number => Math.min(maximum, Math.max(minimum, value));

const round = (value: number, precision = 2): number => {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
};

const logistic = (value: number): number =>
  1 / (1 + Math.exp(-value));

const resolveBand = (
  probability: number,
): WinProbabilityBand => {
  if (probability >= 80) {
    return "highly-probable";
  }

  if (probability >= 60) {
    return "probable";
  }

  if (probability >= 35) {
    return "possible";
  }

  return "unlikely";
};

const resolveTrend = (
  probability: number,
  previousProbability?: number | null,
): WinProbabilityTrend => {
  if (
    previousProbability === null
    || previousProbability === undefined
  ) {
    return "stable";
  }

  const delta = probability - previousProbability;

  if (delta >= 3) {
    return "improving";
  }

  if (delta <= -3) {
    return "declining";
  }

  return "stable";
};

const buildBreakdown = (
  signals: readonly WinProbabilitySignalResult[],
  intercept: number,
): WinProbabilityBreakdown => {
  const available = signals.filter(
    (signal) => signal.available,
  );

  const rawModelScore =
    intercept
    + available.reduce(
      (total, signal) => total + signal.contribution,
      0,
    );

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
    rawModelScore: round(rawModelScore, 4),
    positiveSignals,
    negativeSignals,
  };
};

const calculateConfidence = (
  signals: readonly WinProbabilitySignalResult[],
): number => {
  const available = signals.filter(
    (signal) => signal.available,
  );

  if (available.length === 0) {
    return 0;
  }

  const averageSignalConfidence =
    available.reduce(
      (total, signal) => total + signal.confidence,
      0,
    ) / available.length;

  const coverage =
    (available.length / signals.length) * 100;

  return clamp(
    averageSignalConfidence * 0.7 + coverage * 0.3,
  );
};

const buildExplanation = (
  probability: number,
  breakdown: WinProbabilityBreakdown,
): WinProbabilityExplanation => {
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
            `Improve ${signal.label.toLowerCase()} and validate the supporting evidence.`,
        )
      : [
          "Preserve the current commercial momentum.",
          "Secure the next customer commitment.",
          "Validate the expected close date.",
        ];

  const summary =
    probability >= 80
      ? "The opportunity has a highly favorable predicted win profile."
      : probability >= 60
        ? "The opportunity is more likely than not to convert, based on current evidence."
        : probability >= 35
          ? "The opportunity remains viable, but meaningful uncertainty is present."
          : "The opportunity currently has a low predicted probability of conversion.";

  return {
    summary,
    primaryDrivers,
    primaryRisks,
    recommendedActions,
  };
};

export class WinProbabilityEngine {
  private readonly configuration:
    WinProbabilityConfiguration;

  private readonly signals:
    readonly WinProbabilitySignalDefinition[];

  constructor(
    configuration: Partial<WinProbabilityConfiguration> = {},
    signals?: readonly WinProbabilitySignalDefinition[],
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
      ?? createWinProbabilitySignals(
        this.configuration.signalCoefficients,
      );
  }

  calculate(
    context: WinProbabilityContext,
    calculatedAt = new Date(),
  ): WinProbabilityPrediction {
    this.validateContext(context);

    const signalResults = this.signals.map((signal) => {
      const coefficient =
        this.configuration.signalCoefficients?.[signal.key]
        ?? signal.defaultCoefficient;

      return signal.evaluate(context, coefficient);
    });

    const breakdown = buildBreakdown(
      signalResults,
      this.configuration.intercept,
    );

    const availableRatio =
      breakdown.totalSignals === 0
        ? 0
        : breakdown.availableSignals
          / breakdown.totalSignals;

    const calibratedModelScore =
      breakdown.availableSignals === 0
        ? 0
        : breakdown.rawModelScore
          / Math.max(availableRatio, 0.4);

    const probability = clamp(
      logistic(calibratedModelScore) * 100,
    );

    const confidence = calculateConfidence(signalResults);
    const normalizedProbability = round(probability);
    const normalizedConfidence = round(confidence);

    return {
      tenantId: context.tenantId,
      workspaceId: context.workspaceId,
      opportunityId: context.opportunityId,
      probability: normalizedProbability,
      probabilityBand: resolveBand(
        normalizedProbability,
      ),
      confidence: normalizedConfidence,
      trend: resolveTrend(
        normalizedProbability,
        context.previousProbability,
      ),
      breakdown,
      explanation: buildExplanation(
        normalizedProbability,
        breakdown,
      ),
      modelVersion: this.configuration.modelVersion,
      calculatedAt: calculatedAt.toISOString(),
      sourceScoreCalculatedAt:
        context.opportunityScore.calculatedAt,
      metadata: {
        accountId: context.accountId,
        ownerId: context.ownerId,
        stage: context.stage,
        opportunityScore:
          context.opportunityScore.score,
        opportunityRisk:
          context.opportunityScore.riskLevel,
      },
    };
  }

  private validateContext(
    context: WinProbabilityContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Win probability requires a tenantId.",
      );
    }

    if (!context.opportunityId.trim()) {
      throw new Error(
        "Win probability requires an opportunityId.",
      );
    }

    if (
      context.opportunityScore.tenantId
      !== context.tenantId
    ) {
      throw new Error(
        "Opportunity score tenant does not match the prediction tenant.",
      );
    }

    if (
      context.opportunityScore.opportunityId
      !== context.opportunityId
    ) {
      throw new Error(
        "Opportunity score does not match the prediction opportunity.",
      );
    }
  }
}

export const createWinProbabilityEngine = (
  configuration: Partial<WinProbabilityConfiguration> = {},
): WinProbabilityEngine =>
  new WinProbabilityEngine(configuration);
