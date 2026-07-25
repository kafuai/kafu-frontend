import {
  createSalesCoachingRules,
} from "./SalesCoachingRules";
import type {
  SalesCoachingRule,
} from "./SalesCoachingRules";
import type {
  SalesCoachingConfiguration,
  SalesCoachingContext,
  SalesCoachingPlan,
  SalesCoachingPriority,
  SalesCoachingRecommendation,
  SalesCoachingRuleResult,
} from "./SalesCoachingTypes";

const DEFAULT_CONFIGURATION: SalesCoachingConfiguration = {
  modelVersion: "5.0.0",
  maximumRecommendations: 7,
  recommendationTtlHours: 72,
  minimumRecommendationScore: 35,
  minimumConfidence: 25,
  criticalScoreThreshold: 85,
  highScoreThreshold: 70,
  mediumScoreThreshold: 50,
};

const clamp = (
  value: number,
  minimum = 0,
  maximum = 100,
): number => Math.min(maximum, Math.max(minimum, value));

const round = (
  value: number,
  precision = 2,
): number => {
  const multiplier = 10 ** precision;

  return Math.round(value * multiplier) / multiplier;
};

const average = (
  values: readonly number[],
): number => {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce(
    (total, value) => total + value,
    0,
  ) / values.length;
};

const calculateRecommendationScore = (
  result: SalesCoachingRuleResult,
): number => {
  const score =
    result.severity * 0.35
    + result.opportunityImpact * 0.3
    + result.urgency * 0.25
    + result.evidenceConfidence * 0.1;

  return round(clamp(score));
};

const calculateConfidence = (
  result: SalesCoachingRuleResult,
  context: SalesCoachingContext,
): number => {
  const sourceConfidence =
    clamp(context.winProbability.confidence);

  const confidence =
    result.evidenceConfidence * 0.65
    + sourceConfidence * 0.35;

  return round(clamp(confidence));
};

const resolvePriority = (
  score: number,
  configuration: SalesCoachingConfiguration,
): SalesCoachingPriority => {
  if (score >= configuration.criticalScoreThreshold) {
    return "critical";
  }

  if (score >= configuration.highScoreThreshold) {
    return "high";
  }

  if (score >= configuration.mediumScoreThreshold) {
    return "medium";
  }

  return "low";
};

const resolveExecutiveSummary = (
  recommendations:
    readonly SalesCoachingRecommendation[],
  context: SalesCoachingContext,
): string => {
  if (recommendations.length === 0) {
    return context.winProbability.probability >= 70
      ? "The opportunity has no material coaching intervention at this time. Preserve momentum and continue validating customer commitments."
      : "No recommendation met the minimum evidence threshold. Improve opportunity evidence before relying on automated coaching.";
  }

  const criticalCount = recommendations.filter(
    (recommendation) =>
      recommendation.priority === "critical",
  ).length;

  const highCount = recommendations.filter(
    (recommendation) =>
      recommendation.priority === "high",
  ).length;

  const top = recommendations[0];

  if (criticalCount > 0) {
    return `Immediate management intervention is required. The primary coaching focus is "${top.title}", with ${criticalCount} critical recommendation${criticalCount === 1 ? "" : "s"} requiring action.`;
  }

  if (highCount > 0) {
    return `The opportunity requires focused coaching to protect conversion quality. The highest-priority intervention is "${top.title}".`;
  }

  return `The opportunity has manageable coaching needs. The current priority is "${top.title}".`;
};

const resolveImmediateFocus = (
  recommendations:
    readonly SalesCoachingRecommendation[],
): readonly string[] =>
  recommendations
    .filter(
      (recommendation) =>
        recommendation.priority === "critical"
        || recommendation.priority === "high",
    )
    .slice(0, 3)
    .map((recommendation) => recommendation.title);

export class SalesCoachingEngine {
  private readonly configuration:
    SalesCoachingConfiguration;

  private readonly rules:
    readonly SalesCoachingRule[];

  constructor(
    configuration:
      Partial<SalesCoachingConfiguration> = {},
    rules?: readonly SalesCoachingRule[],
  ) {
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...configuration,
    };

    this.rules =
      rules ?? createSalesCoachingRules();
  }

  generate(
    context: SalesCoachingContext,
    generatedAt = new Date(),
  ): SalesCoachingPlan {
    this.validateContext(context);

    const expiresAt = new Date(
      generatedAt.getTime()
      + this.configuration.recommendationTtlHours
        * 60
        * 60
        * 1000,
    );

    const evaluated = this.rules
      .map((rule) => rule.evaluate(context, generatedAt))
      .filter((result) => result.applicable)
      .map((result) =>
        this.createRecommendation(
          result,
          context,
          generatedAt,
          expiresAt,
        ),
      )
      .filter(
        (recommendation) =>
          recommendation.score
            >= this.configuration
              .minimumRecommendationScore
          && recommendation.confidence
            >= this.configuration.minimumConfidence,
      )
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        if (right.urgency !== left.urgency) {
          return right.urgency - left.urgency;
        }

        return right.confidence - left.confidence;
      });

    const deduplicated = this.deduplicate(
      evaluated,
      context.previousRecommendationKeys ?? [],
    ).slice(
      0,
      this.configuration.maximumRecommendations,
    );

    const criticalCount = this.countPriority(
      deduplicated,
      "critical",
    );

    const highCount = this.countPriority(
      deduplicated,
      "high",
    );

    const mediumCount = this.countPriority(
      deduplicated,
      "medium",
    );

    const lowCount = this.countPriority(
      deduplicated,
      "low",
    );

    const planScore = round(
      deduplicated.length === 0
        ? 0
        : average(
            deduplicated.map(
              (recommendation) =>
                recommendation.score,
            ),
          ),
    );

    const confidence = round(
      deduplicated.length === 0
        ? context.winProbability.confidence
        : average(
            deduplicated.map(
              (recommendation) =>
                recommendation.confidence,
            ),
          ),
    );

    return {
      tenantId: context.tenantId,
      workspaceId: context.workspaceId,
      opportunityId: context.opportunityId,
      accountId: context.accountId,
      ownerId: context.ownerId,

      recommendations: deduplicated,

      criticalCount,
      highCount,
      mediumCount,
      lowCount,

      totalRecommendations: deduplicated.length,
      planScore,
      confidence,

      executiveSummary: resolveExecutiveSummary(
        deduplicated,
        context,
      ),
      immediateFocus:
        resolveImmediateFocus(deduplicated),
      managementAttentionRequired:
        criticalCount > 0
        || highCount >= 2,

      sourceProbability:
        context.winProbability.probability,
      sourceProbabilityBand:
        context.winProbability.probabilityBand,
      sourceProbabilityTrend:
        context.winProbability.trend,
      sourcePredictionCalculatedAt:
        context.winProbability.calculatedAt,

      modelVersion: this.configuration.modelVersion,
      generatedAt: generatedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),

      metadata: {
        stage: context.stage,
        expectedCloseDate:
          context.expectedCloseDate,
        recommendationRuleCount:
          this.rules.length,
        evaluatedRecommendationCount:
          evaluated.length,
      },
    };
  }

  private createRecommendation(
    result: SalesCoachingRuleResult,
    context: SalesCoachingContext,
    generatedAt: Date,
    expiresAt: Date,
  ): SalesCoachingRecommendation {
    const score =
      calculateRecommendationScore(result);

    const confidence =
      calculateConfidence(result, context);

    return {
      tenantId: context.tenantId,
      workspaceId: context.workspaceId,
      opportunityId: context.opportunityId,
      accountId: context.accountId,
      ownerId: context.ownerId,

      ruleKey: result.ruleKey,
      category: result.category,
      priority: resolvePriority(
        score,
        this.configuration,
      ),
      effort: result.effort,

      title: result.title,
      summary: result.summary,
      rationale: result.rationale,
      expectedImpact: result.expectedImpact,

      score,
      confidence,
      urgency: round(clamp(result.urgency)),

      actions: result.actions.map(
        (action, index) => ({
          ...action,
          id: [
            context.opportunityId,
            result.ruleKey,
            "action",
            index + 1,
          ].join(":"),
        }),
      ),
      evidence: result.evidence,

      status: "proposed",
      outcome: "pending",

      modelVersion:
        this.configuration.modelVersion,
      generatedAt: generatedAt.toISOString(),
      expiresAt: expiresAt.toISOString(),

      metadata: {
        sourceProbability:
          context.winProbability.probability,
        sourceProbabilityBand:
          context.winProbability.probabilityBand,
        sourceProbabilityTrend:
          context.winProbability.trend,
        sourcePredictionId:
          context.winProbability.id,
      },
    };
  }

  private deduplicate(
    recommendations:
      readonly SalesCoachingRecommendation[],
    previousKeys:
      readonly SalesCoachingRecommendation["ruleKey"][],
  ): readonly SalesCoachingRecommendation[] {
    const selected =
      new Map<
        SalesCoachingRecommendation["ruleKey"],
        SalesCoachingRecommendation
      >();

    for (const recommendation of recommendations) {
      const existing =
        selected.get(recommendation.ruleKey);

      if (
        !existing
        || recommendation.score > existing.score
      ) {
        selected.set(
          recommendation.ruleKey,
          recommendation,
        );
      }
    }

    return [...selected.values()].sort(
      (left, right) => {
        const leftPreviouslyRecommended =
          previousKeys.includes(left.ruleKey);

        const rightPreviouslyRecommended =
          previousKeys.includes(right.ruleKey);

        if (
          leftPreviouslyRecommended
          !== rightPreviouslyRecommended
        ) {
          return leftPreviouslyRecommended ? 1 : -1;
        }

        return right.score - left.score;
      },
    );
  }

  private countPriority(
    recommendations:
      readonly SalesCoachingRecommendation[],
    priority: SalesCoachingPriority,
  ): number {
    return recommendations.filter(
      (recommendation) =>
        recommendation.priority === priority,
    ).length;
  }

  private validateContext(
    context: SalesCoachingContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Sales coaching requires a tenantId.",
      );
    }

    if (!context.opportunityId.trim()) {
      throw new Error(
        "Sales coaching requires an opportunityId.",
      );
    }

    if (
      context.winProbability.tenantId
      !== context.tenantId
    ) {
      throw new Error(
        "Win-probability tenant does not match the sales-coaching tenant.",
      );
    }

    if (
      context.winProbability.opportunityId
      !== context.opportunityId
    ) {
      throw new Error(
        "Win-probability opportunity does not match the sales-coaching opportunity.",
      );
    }

    if (
      context.workspaceId
      && context.winProbability.workspaceId
      && context.workspaceId
        !== context.winProbability.workspaceId
    ) {
      throw new Error(
        "Win-probability workspace does not match the sales-coaching workspace.",
      );
    }
  }
}

export const createSalesCoachingEngine = (
  configuration:
    Partial<SalesCoachingConfiguration> = {},
): SalesCoachingEngine =>
  new SalesCoachingEngine(configuration);


