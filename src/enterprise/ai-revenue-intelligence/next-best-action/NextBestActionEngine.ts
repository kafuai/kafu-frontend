import type {
  NextBestActionCandidate,
  NextBestActionConfiguration,
  NextBestActionContext,
  NextBestActionPlan,
  NextBestActionPriority,
  NextBestActionRecommendation,
  NextBestActionType,
} from "./NextBestActionTypes";
import {
  createNextBestActionSignals,
  type NextBestActionSignalDefinition,
} from "./NextBestActionSignals";

const DEFAULT_CONFIGURATION:
  NextBestActionConfiguration = {
    modelVersion: "5.0.0",

    cacheTtlMs: 5 * 60 * 1000,

    planExpiryHours: 24,

    recommendationExpiryHours: 72,

    maximumRecommendations: 5,

    minimumRankScore: 25,

    minimumConfidence: 25,

    duplicateActionPenalty: 35,

    previousRecommendationPenalty: 10,
  };

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
  precision = 2,
): number => {
  const multiplier = 10 ** precision;

  return (
    Math.round(value * multiplier)
    / multiplier
  );
};

const addHours = (
  date: Date,
  hours: number,
): Date =>
  new Date(
    date.getTime()
    + hours * 60 * 60 * 1000,
  );

const priorityOrder:
  Record<NextBestActionPriority, number> = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

const applyActionPenalties = (
  candidate: NextBestActionCandidate,
  context: NextBestActionContext,
  configuration:
    NextBestActionConfiguration,
): NextBestActionCandidate => {
  const isAlreadyOpen =
    context.existingOpenActionTypes
      ?.includes(candidate.actionType)
    ?? false;

  const wasPreviouslyRecommended =
    context.previousRecommendedActionTypes
      ?.includes(candidate.actionType)
    ?? false;

  const penalty =
    (
      isAlreadyOpen
        ? configuration
            .duplicateActionPenalty
        : 0
    )
    + (
      wasPreviouslyRecommended
        ? configuration
            .previousRecommendationPenalty
        : 0
    );

  return {
    ...candidate,

    rankScore:
      round(
        clamp(
          candidate.rankScore
          - penalty,
        ),
      ),
  };
};

const deduplicateCandidates = (
  candidates:
    readonly NextBestActionCandidate[],
): readonly NextBestActionCandidate[] => {
  const byType =
    new Map<
      NextBestActionType,
      NextBestActionCandidate
    >();

  for (const candidate of candidates) {
    const current =
      byType.get(
        candidate.actionType,
      );

    if (
      !current
      || candidate.rankScore
        > current.rankScore
    ) {
      byType.set(
        candidate.actionType,
        candidate,
      );
    }
  }

  return [...byType.values()];
};

const calculatePlanConfidence = (
  recommendations:
    readonly NextBestActionRecommendation[],
): number => {
  if (recommendations.length === 0) {
    return 0;
  }

  const weightedConfidence =
    recommendations.reduce(
      (total, recommendation) =>
        total
        + recommendation.confidence
          * recommendation.rankScore,
      0,
    );

  const totalRank =
    recommendations.reduce(
      (total, recommendation) =>
        total
        + recommendation.rankScore,
      0,
    );

  if (totalRank === 0) {
    return 0;
  }

  return clamp(
    weightedConfidence / totalRank,
  );
};

const calculateExpectedRevenueImpact = (
  context: NextBestActionContext,
  recommendations:
    readonly NextBestActionRecommendation[],
): number | undefined => {
  if (
    context.dealValue <= 0
    || recommendations.length === 0
  ) {
    return undefined;
  }

  const averageImpact =
    recommendations.reduce(
      (total, recommendation) =>
        total
        + recommendation.impactScore,
      0,
    ) / recommendations.length;

  const recoveryFactor =
    clamp(
      averageImpact
      * (
        context.dealRisk.riskScore
        / 100
      ),
      0,
      100,
    ) / 100;

  return round(
    context.dealValue
    * recoveryFactor
    * 0.2,
  );
};

const buildSummary = (
  recommendations:
    readonly NextBestActionRecommendation[],
): string => {
  if (recommendations.length === 0) {
    return (
      "No action currently exceeds the recommendation threshold."
    );
  }

  const urgentCount =
    recommendations.filter(
      (recommendation) =>
        recommendation.priority === "urgent",
    ).length;

  const highCount =
    recommendations.filter(
      (recommendation) =>
        recommendation.priority === "high",
    ).length;

  if (urgentCount > 0) {
    return (
      `${urgentCount} urgent action`
      + (
        urgentCount === 1
          ? ""
          : "s"
      )
      + " require immediate execution."
    );
  }

  if (highCount > 0) {
    return (
      `${highCount} high-priority action`
      + (
        highCount === 1
          ? ""
          : "s"
      )
      + " should be completed during the current sales cycle."
    );
  }

  return (
    `${recommendations.length} recommended action`
    + (
      recommendations.length === 1
        ? ""
        : "s"
    )
    + " can improve opportunity progression."
  );
};

export class NextBestActionEngine {
  private readonly configuration:
    NextBestActionConfiguration;

  private readonly signals:
    readonly NextBestActionSignalDefinition[];

  constructor(
    configuration: Partial<
      NextBestActionConfiguration
    > = {},
    signals?: readonly NextBestActionSignalDefinition[],
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
      ?? createNextBestActionSignals(
        this.configuration.signalWeights,
      );
  }

  calculate(
    context: NextBestActionContext,
    calculatedAt = new Date(),
    maximumRecommendations?: number,
  ): NextBestActionPlan {
    this.validateContext(context);

    const rawCandidates =
      this.signals.flatMap(
        (signal) => {
          const weight =
            this.configuration
              .signalWeights?.[signal.key]
            ?? signal.defaultWeight;

          return signal.evaluate(
            context,
            weight,
          );
        },
      );

    const rankedCandidates =
      deduplicateCandidates(
        rawCandidates.map(
          (candidate) =>
            applyActionPenalties(
              candidate,
              context,
              this.configuration,
            ),
        ),
      )
        .filter(
          (candidate) =>
            candidate.rankScore
              >= this.configuration
                .minimumRankScore
            && candidate.confidence
              >= this.configuration
                .minimumConfidence,
        )
        .sort(
          (left, right) =>
            priorityOrder[right.priority]
              - priorityOrder[left.priority]
            || right.rankScore
              - left.rankScore
            || right.impactScore
              - left.impactScore
            || left.effortScore
              - right.effortScore,
        );

    const selectionLimit =
      Math.max(
        1,
        Math.min(
          maximumRecommendations
            ?? this.configuration
              .maximumRecommendations,

          this.configuration
            .maximumRecommendations,
        ),
      );

    const planExpiresAt =
      addHours(
        calculatedAt,
        this.configuration
          .planExpiryHours,
      );

    const recommendations:
      NextBestActionRecommendation[] =
      rankedCandidates
        .slice(0, selectionLimit)
        .map(
          (candidate, index) => {
            const dueAt =
              addHours(
                calculatedAt,
                candidate.dueWithinHours,
              );

            const expiresAt =
              addHours(
                calculatedAt,
                Math.max(
                  candidate.dueWithinHours,
                  this.configuration
                    .recommendationExpiryHours,
                ),
              );

            return {
              tenantId:
                context.tenantId,

              workspaceId:
                context.workspaceId,

              opportunityId:
                context.opportunityId,

              actionType:
                candidate.actionType,

              status:
                "recommended",

              priority:
                candidate.priority,

              title:
                candidate.title,

              description:
                candidate.description,

              channel:
                candidate.channel,

              rank:
                index + 1,

              rankScore:
                candidate.rankScore,

              impactScore:
                candidate.impactScore,

              urgencyScore:
                candidate.urgencyScore,

              confidence:
                candidate.confidence,

              effortScore:
                candidate.effortScore,

              reason:
                candidate.reason,

              evidence:
                candidate.evidence,

              expectedOutcome:
                candidate.expectedOutcome,

              recommendedOwnerRole:
                candidate
                  .recommendedOwnerRole,

              requiresApproval:
                candidate.requiresApproval
                ?? false,

              relatedRiskCategory:
                candidate
                  .relatedRiskCategory,

              relatedRiskSignal:
                candidate
                  .relatedRiskSignal,

              relatedRiskLevel:
                candidate
                  .relatedRiskLevel,

              recommendedAt:
                calculatedAt.toISOString(),

              dueAt:
                dueAt.toISOString(),

              expiresAt:
                expiresAt.toISOString(),

              modelVersion:
                this.configuration
                  .modelVersion,

              metadata: {
                signalKey:
                  candidate.signalKey,

                relevanceScore:
                  candidate.relevanceScore,

                accountId:
                  context.accountId,

                ownerId:
                  context.ownerId,

                stage:
                  context.stage,
              },
            };
          },
        );

    const confidence =
      round(
        calculatePlanConfidence(
          recommendations,
        ),
      );

    return {
      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      opportunityId:
        context.opportunityId,

      recommendations,

      primaryRecommendation:
        recommendations[0],

      totalCandidates:
        rawCandidates.length,

      selectedRecommendations:
        recommendations.length,

      urgentCount:
        recommendations.filter(
          (recommendation) =>
            recommendation.priority
            === "urgent",
        ).length,

      highPriorityCount:
        recommendations.filter(
          (recommendation) =>
            recommendation.priority
            === "high",
        ).length,

      confidence,

      summary:
        buildSummary(
          recommendations,
        ),

      expectedRevenueImpact:
        calculateExpectedRevenueImpact(
          context,
          recommendations,
        ),

      modelVersion:
        this.configuration.modelVersion,

      calculatedAt:
        calculatedAt.toISOString(),

      expiresAt:
        planExpiresAt.toISOString(),

      sourceDealRiskCalculatedAt:
        context.dealRisk.calculatedAt,

      sourceOpportunityScoreCalculatedAt:
        context.opportunityScore.calculatedAt,

      sourceWinProbabilityCalculatedAt:
        context.winProbability.calculatedAt,

      sourceRevenuePredictionCalculatedAt:
        context.revenuePrediction
          ?.calculatedAt,

      metadata: {
        currency:
          context.currency,

        dealValue:
          round(context.dealValue),

        dealRiskScore:
          context.dealRisk.riskScore,

        dealRiskLevel:
          context.dealRisk.riskLevel,

        opportunityScore:
          context.opportunityScore.score,

        winProbability:
          context.winProbability.probability,

        predictedRevenue:
          context.revenuePrediction
            ?.expectedRevenue,
      },
    };
  }

  private validateContext(
    context: NextBestActionContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Next best action requires a tenantId.",
      );
    }

    if (!context.opportunityId.trim()) {
      throw new Error(
        "Next best action requires an opportunityId.",
      );
    }

    if (!context.currency.trim()) {
      throw new Error(
        "Next best action requires a currency.",
      );
    }

    if (
      !Number.isFinite(context.dealValue)
      || context.dealValue < 0
    ) {
      throw new Error(
        "Next best action requires a valid deal value.",
      );
    }

    if (
      context.opportunityScore.tenantId
        !== context.tenantId
      || context.winProbability.tenantId
        !== context.tenantId
      || context.dealRisk.tenantId
        !== context.tenantId
    ) {
      throw new Error(
        "Next best action sources do not match the tenant.",
      );
    }

    if (
      context.opportunityScore
        .opportunityId
        !== context.opportunityId
      || context.winProbability
        .opportunityId
        !== context.opportunityId
      || context.dealRisk
        .opportunityId
        !== context.opportunityId
    ) {
      throw new Error(
        "Next best action sources do not match the opportunity.",
      );
    }

    if (
      context.revenuePrediction
      && (
        context.revenuePrediction
          .tenantId
          !== context.tenantId
        || context.revenuePrediction
          .opportunityId
          !== context.opportunityId
      )
    ) {
      throw new Error(
        "Revenue prediction does not match the next-best-action scope.",
      );
    }
  }
}

export const createNextBestActionEngine = (
  configuration: Partial<
    NextBestActionConfiguration
  > = {},
): NextBestActionEngine =>
  new NextBestActionEngine(
    configuration,
  );

