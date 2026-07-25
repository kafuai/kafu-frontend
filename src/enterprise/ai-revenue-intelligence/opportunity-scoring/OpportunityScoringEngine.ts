import {
  OpportunityRiskLevel,
  OpportunityScore,
  OpportunityScoreBand,
  OpportunityScoreBreakdown,
  OpportunityScoringConfiguration,
  OpportunityScoringContext,
  OpportunityScoringExplanation,
  OpportunityScoringFactorResult,
} from "./OpportunityScoringTypes";
import {
  createOpportunityScoringFactors,
  OpportunityScoringFactorDefinition,
} from "./OpportunityScoringFactors";

const DEFAULT_CONFIGURATION: OpportunityScoringConfiguration = {
  scoringVersion: "5.0.0",
  materialChangeThreshold: 5,
  cacheTtlMs: 5 * 60 * 1000,
  minimumConfidence: 25,
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

const resolveScoreBand = (
  score: number,
): OpportunityScoreBand => {
  if (score >= 85) {
    return "very-high";
  }

  if (score >= 70) {
    return "high";
  }

  if (score >= 50) {
    return "medium";
  }

  if (score >= 30) {
    return "low";
  }

  return "very-low";
};

const resolveRiskLevel = (
  score: number,
  confidence: number,
): OpportunityRiskLevel => {
  if (score < 30 || confidence < 25) {
    return "critical";
  }

  if (score < 50 || confidence < 45) {
    return "high";
  }

  if (score < 70 || confidence < 65) {
    return "moderate";
  }

  return "low";
};

const buildBreakdown = (
  factors: readonly OpportunityScoringFactorResult[],
): OpportunityScoreBreakdown => {
  const availableFactors = factors.filter(
    (factor) => factor.available,
  );

  const totalWeight = factors.reduce(
    (total, factor) => total + factor.weight,
    0,
  );

  const availableWeight = availableFactors.reduce(
    (total, factor) => total + factor.weight,
    0,
  );

  const rawWeightedScore = availableFactors.reduce(
    (total, factor) => total + factor.weightedScore,
    0,
  );

  const sorted = [...availableFactors].sort(
    (left, right) =>
      right.normalizedScore - left.normalizedScore,
  );

  return {
    factors,
    totalWeight: round(totalWeight, 4),
    availableWeight: round(availableWeight, 4),
    rawWeightedScore: round(rawWeightedScore, 4),
    positiveFactors: sorted
      .filter((factor) => factor.normalizedScore >= 65)
      .slice(0, 4),
    negativeFactors: [...availableFactors]
      .sort(
        (left, right) =>
          left.normalizedScore - right.normalizedScore,
      )
      .filter((factor) => factor.normalizedScore < 50)
      .slice(0, 4),
  };
};

const buildExplanation = (
  score: number,
  breakdown: OpportunityScoreBreakdown,
): OpportunityScoringExplanation => {
  const strengths = breakdown.positiveFactors.map(
    (factor) => `${factor.label}: ${factor.reason}`,
  );

  const risks = breakdown.negativeFactors.map(
    (factor) => `${factor.label}: ${factor.reason}`,
  );

  const recommendedFocus =
    breakdown.negativeFactors.length > 0
      ? breakdown.negativeFactors.map(
          (factor) =>
            `Improve ${factor.label.toLowerCase()} and validate its supporting evidence.`,
        )
      : [
          "Preserve current opportunity momentum.",
          "Validate the expected close date and next commercial commitment.",
        ];

  const summary =
    score >= 70
      ? "The opportunity has a strong conversion profile supported by the available commercial signals."
      : score >= 50
        ? "The opportunity remains viable, but specific commercial signals require active improvement."
        : "The opportunity has material conversion risk and requires immediate corrective action.";

  return {
    summary,
    strengths,
    risks,
    recommendedFocus,
  };
};

const calculateConfidence = (
  factors: readonly OpportunityScoringFactorResult[],
  availableWeight: number,
  totalWeight: number,
): number => {
  const availableFactors = factors.filter(
    (factor) => factor.available,
  );

  if (
    availableFactors.length === 0
    || availableWeight <= 0
    || totalWeight <= 0
  ) {
    return 0;
  }

  const weightedFactorConfidence = availableFactors.reduce(
    (total, factor) =>
      total + factor.confidence * factor.weight,
    0,
  );

  const factorConfidence =
    weightedFactorConfidence / availableWeight;

  const coverageConfidence =
    clamp((availableWeight / totalWeight) * 100);

  return clamp(
    factorConfidence * 0.65 + coverageConfidence * 0.35,
  );
};

export class OpportunityScoringEngine {
  private readonly configuration:
    OpportunityScoringConfiguration;

  private readonly factors:
    readonly OpportunityScoringFactorDefinition[];

  constructor(
    configuration: Partial<OpportunityScoringConfiguration> = {},
    factors?: readonly OpportunityScoringFactorDefinition[],
  ) {
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...configuration,
      factorWeights: {
        ...DEFAULT_CONFIGURATION.factorWeights,
        ...configuration.factorWeights,
      },
    };

    this.factors =
      factors
      ?? createOpportunityScoringFactors(
        this.configuration.factorWeights,
      );
  }

  calculate(
    context: OpportunityScoringContext,
    calculatedAt = new Date(),
  ): OpportunityScore {
    this.validateContext(context);

    const factorResults = this.factors.map((factor) => {
      const configuredWeight =
        this.configuration.factorWeights?.[factor.key]
        ?? factor.defaultWeight;

      return factor.evaluate(context, configuredWeight);
    });

    const breakdown = buildBreakdown(factorResults);

    const score =
      breakdown.availableWeight > 0
        ? clamp(
            breakdown.rawWeightedScore
              / breakdown.availableWeight,
          )
        : 0;

    const confidence = calculateConfidence(
      factorResults,
      breakdown.availableWeight,
      breakdown.totalWeight,
    );

    const normalizedScore = round(score);
    const normalizedConfidence = round(confidence);

    return {
      tenantId: context.tenantId,
      workspaceId: context.workspaceId,
      opportunityId: context.opportunityId,
      score: normalizedScore,
      scoreBand: resolveScoreBand(normalizedScore),
      confidence: normalizedConfidence,
      riskLevel: resolveRiskLevel(
        normalizedScore,
        normalizedConfidence,
      ),
      breakdown,
      explanation: buildExplanation(
        normalizedScore,
        breakdown,
      ),
      scoringVersion: this.configuration.scoringVersion,
      calculatedAt: calculatedAt.toISOString(),
      sourceUpdatedAt:
        context.lastActivityAt
        ?? context.createdAt
        ?? undefined,
      metadata: {
        accountId: context.accountId,
        ownerId: context.ownerId,
        stage: context.stage,
        expectedCloseDate: context.expectedCloseDate,
      },
    };
  }

  private validateContext(
    context: OpportunityScoringContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Opportunity scoring requires a tenantId.",
      );
    }

    if (!context.opportunityId.trim()) {
      throw new Error(
        "Opportunity scoring requires an opportunityId.",
      );
    }

    const numericValues: readonly [
      string,
      number | null | undefined,
    ][] = [
      ["amount", context.amount],
      ["expectedRevenue", context.expectedRevenue],
      ["activityCount30Days", context.activityCount30Days],
      [
        "meaningfulActivityCount30Days",
        context.meaningfulActivityCount30Days,
      ],
      [
        "responseVelocityHours",
        context.responseVelocityHours,
      ],
      [
        "daysSinceLastActivity",
        context.daysSinceLastActivity,
      ],
      ["competitorCount", context.competitorCount],
    ];

    for (const [field, value] of numericValues) {
      if (
        value !== null
        && value !== undefined
        && (!Number.isFinite(value) || value < 0)
      ) {
        throw new Error(
          `Opportunity scoring received an invalid ${field}.`,
        );
      }
    }
  }
}

export const createOpportunityScoringEngine = (
  configuration: Partial<OpportunityScoringConfiguration> = {},
): OpportunityScoringEngine =>
  new OpportunityScoringEngine(configuration);
