import type {
  SalesForecast,
  SalesForecastCategory,
  SalesForecastCategorySummary,
  SalesForecastConfidence,
  SalesForecastConfiguration,
  SalesForecastContext,
  SalesForecastExplanation,
  SalesForecastHealth,
  SalesForecastOpportunityInput,
  SalesForecastOpportunityResult,
  SalesForecastOwnerSummary,
  SalesForecastRiskSummary,
  SalesForecastSignalResult,
  SalesForecastTrend,
} from "./SalesForecastTypes";
import {
  createSalesForecastSignals,
  type SalesForecastSignalDefinition,
} from "./SalesForecastSignals";

const DEFAULT_CONFIGURATION:
  SalesForecastConfiguration = {
    modelVersion: "5.0.0",

    cacheTtlMs: 5 * 60 * 1000,

    minimumConfidence: 25,

    materialChangeThreshold: 5,

    healthyCoverageThreshold: 1,

    watchCoverageThreshold: 0.8,
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

const average = (
  values: readonly number[],
): number =>
  values.length === 0
    ? 0
    : values.reduce(
        (total, value) =>
          total + value,
        0,
      ) / values.length;

const resolveConfidenceLevel = (
  confidence: number,
): SalesForecastConfidence => {
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

const resolveForecastCategory = (
  opportunity:
    SalesForecastOpportunityInput,
): SalesForecastCategory => {
  if (
    opportunity.isClosed
    && opportunity.isWon
  ) {
    return "closed";
  }

  if (opportunity.forecastCategory) {
    return opportunity.forecastCategory;
  }

  if (
    opportunity.winProbability
      .probability >= 80
  ) {
    return "commit";
  }

  if (
    opportunity.winProbability
      .probability >= 55
  ) {
    return "best-case";
  }

  return "pipeline";
};

const isIncludedInPeriod = (
  opportunity:
    SalesForecastOpportunityInput,
  periodStart: Date,
  periodEnd: Date,
): {
  included: boolean;
  reason: string;
} => {
  if (
    opportunity.isClosed
    && opportunity.isWon
  ) {
    if (!opportunity.actualCloseDate) {
      return {
        included: false,
        reason:
          "Closed-won opportunity has no actual close date.",
      };
    }

    const actualCloseDate =
      new Date(
        opportunity.actualCloseDate,
      );

    const included =
      !Number.isNaN(
        actualCloseDate.getTime(),
      )
      && actualCloseDate >= periodStart
      && actualCloseDate <= periodEnd;

    return {
      included,

      reason:
        included
          ? "Closed-won during the forecast period."
          : "Actual close date is outside the forecast period.",
    };
  }

  if (!opportunity.expectedCloseDate) {
    return {
      included: false,
      reason:
        "Expected close date is unavailable.",
    };
  }

  const expectedCloseDate =
    new Date(
      opportunity.expectedCloseDate,
    );

  const included =
    !Number.isNaN(
      expectedCloseDate.getTime(),
    )
    && expectedCloseDate >= periodStart
    && expectedCloseDate <= periodEnd;

  return {
    included,

    reason:
      included
        ? "Expected close date is within the forecast period."
        : "Expected close date is outside the forecast period.",
  };
};

const buildOpportunityResults = (
  context: SalesForecastContext,
): readonly SalesForecastOpportunityResult[] => {
  const periodStart =
    new Date(context.periodStart);

  const periodEnd =
    new Date(context.periodEnd);

  const baseResults =
    context.opportunities.map(
      (opportunity) => {
        const inclusion =
          isIncludedInPeriod(
            opportunity,
            periodStart,
            periodEnd,
          );

        const category =
          resolveForecastCategory(
            opportunity,
          );

        const predictedRevenue =
          opportunity.isClosed
          && opportunity.isWon
            ? opportunity.dealValue
            : opportunity
                .revenuePrediction
                .predictedRevenue;

        const weightedRevenue =
          opportunity.isClosed
          && opportunity.isWon
            ? opportunity.dealValue
            : opportunity.dealValue
              * (
                opportunity
                  .winProbability
                  .probability
                / 100
              );

        return {
          opportunityId:
            opportunity.opportunityId,

          accountId:
            opportunity.accountId,

          ownerId:
            opportunity.ownerId,

          ownerName:
            opportunity.ownerName,

          name:
            opportunity.name,

          dealValue:
            round(
              opportunity.dealValue,
            ),

          predictedRevenue:
            round(predictedRevenue),

          weightedRevenue:
            round(weightedRevenue),

          winProbability:
            opportunity
              .winProbability
              .probability,

          confidence:
            opportunity
              .revenuePrediction
              .confidence,

          forecastCategory:
            category,

          riskLevel:
            opportunity.dealRisk
              ?.riskLevel
            ?? opportunity
              .revenuePrediction
              .riskLevel,

          expectedCloseDate:
            opportunity
              .expectedCloseDate
            ?? undefined,

          includedInPeriod:
            inclusion.included,

          inclusionReason:
            inclusion.reason,

          contributionPercent: 0,

          metadata:
            opportunity.metadata,
        } satisfies SalesForecastOpportunityResult;
      },
    );

  const totalPredicted =
    baseResults
      .filter(
        (result) =>
          result.includedInPeriod,
      )
      .reduce(
        (total, result) =>
          total
          + result.predictedRevenue,
        0,
      );

  return baseResults.map(
    (result) => ({
      ...result,

      contributionPercent:
        !result.includedInPeriod
        || totalPredicted <= 0
          ? 0
          : round(
              (
                result.predictedRevenue
                / totalPredicted
              ) * 100,
            ),
    }),
  );
};

const buildCategorySummaries = (
  results:
    readonly SalesForecastOpportunityResult[],
  predictedRevenue: number,
): readonly SalesForecastCategorySummary[] => {
  const categories:
    readonly SalesForecastCategory[] = [
      "pipeline",
      "best-case",
      "commit",
      "closed",
    ];

  return categories.map(
    (category) => {
      const categoryResults =
        results.filter(
          (result) =>
            result.includedInPeriod
            && result.forecastCategory
              === category,
        );

      const categoryPredicted =
        categoryResults.reduce(
          (total, result) =>
            total
            + result.predictedRevenue,
          0,
        );

      return {
        category,

        opportunityCount:
          categoryResults.length,

        pipelineValue:
          round(
            categoryResults.reduce(
              (total, result) =>
                total
                + result.dealValue,
              0,
            ),
          ),

        predictedRevenue:
          round(categoryPredicted),

        weightedRevenue:
          round(
            categoryResults.reduce(
              (total, result) =>
                total
                + result.weightedRevenue,
              0,
            ),
          ),

        averageProbability:
          round(
            average(
              categoryResults.map(
                (result) =>
                  result.winProbability,
              ),
            ),
          ),

        averageConfidence:
          round(
            average(
              categoryResults.map(
                (result) =>
                  result.confidence,
              ),
            ),
          ),

        shareOfForecast:
          predictedRevenue <= 0
            ? 0
            : round(
                (
                  categoryPredicted
                  / predictedRevenue
                ) * 100,
              ),
      };
    },
  );
};

const buildOwnerSummaries = (
  results:
    readonly SalesForecastOpportunityResult[],
): readonly SalesForecastOwnerSummary[] => {
  const included =
    results.filter(
      (result) =>
        result.includedInPeriod,
    );

  const ownerKeys =
    new Set(
      included.map(
        (result) =>
          result.ownerId
          ?? result.ownerName
          ?? "unassigned",
      ),
    );

  return [...ownerKeys].map(
    (ownerKey) => {
      const ownerResults =
        included.filter(
          (result) =>
            (
              result.ownerId
              ?? result.ownerName
              ?? "unassigned"
            ) === ownerKey,
        );

      return {
        ownerId:
          ownerResults[0]?.ownerId,

        ownerName:
          ownerResults[0]?.ownerName
          ?? (
            ownerKey === "unassigned"
              ? "Unassigned"
              : ownerKey
          ),

        opportunityCount:
          ownerResults.length,

        pipelineValue:
          round(
            ownerResults.reduce(
              (total, result) =>
                total
                + result.dealValue,
              0,
            ),
          ),

        predictedRevenue:
          round(
            ownerResults.reduce(
              (total, result) =>
                total
                + result.predictedRevenue,
              0,
            ),
          ),

        weightedRevenue:
          round(
            ownerResults.reduce(
              (total, result) =>
                total
                + result.weightedRevenue,
              0,
            ),
          ),

        riskOpportunityCount:
          ownerResults.filter(
            (result) =>
              result.riskLevel
              === "high"
              || result.riskLevel
              === "critical",
          ).length,

        criticalOpportunityCount:
          ownerResults.filter(
            (result) =>
              result.riskLevel
              === "critical",
          ).length,
      };
    },
  );
};

const buildRiskSummary = (
  results:
    readonly SalesForecastOpportunityResult[],
): SalesForecastRiskSummary => {
  const included =
    results.filter(
      (result) =>
        result.includedInPeriod,
    );

  const atRisk =
    included.filter(
      (result) =>
        result.riskLevel === "high"
        || result.riskLevel
          === "critical",
    );

  return {
    lowRiskCount:
      included.filter(
        (result) =>
          result.riskLevel === "low",
      ).length,

    moderateRiskCount:
      included.filter(
        (result) =>
          result.riskLevel
          === "moderate",
      ).length,

    highRiskCount:
      included.filter(
        (result) =>
          result.riskLevel === "high",
      ).length,

    criticalRiskCount:
      included.filter(
        (result) =>
          result.riskLevel
          === "critical",
      ).length,

    atRiskPipelineValue:
      round(
        atRisk.reduce(
          (total, result) =>
            total + result.dealValue,
          0,
        ),
      ),

    atRiskPredictedRevenue:
      round(
        atRisk.reduce(
          (total, result) =>
            total
            + result.predictedRevenue,
          0,
        ),
      ),

    topRiskOpportunityIds:
      [...atRisk]
        .sort(
          (left, right) =>
            right.predictedRevenue
            - left.predictedRevenue,
        )
        .slice(0, 10)
        .map(
          (result) =>
            result.opportunityId,
        ),
  };
};

const calculateConfidence = (
  signals:
    readonly SalesForecastSignalResult[],
): number => {
  const available =
    signals.filter(
      (signal) =>
        signal.available,
    );

  if (available.length === 0) {
    return 0;
  }

  const totalWeight =
    available.reduce(
      (total, signal) =>
        total
        + Math.abs(signal.weight),
      0,
    );

  if (totalWeight === 0) {
    return 0;
  }

  const quality =
    available.reduce(
      (total, signal) =>
        total
        + signal.score
          * Math.abs(signal.weight),
      0,
    ) / totalWeight;

  const evidenceConfidence =
    available.reduce(
      (total, signal) =>
        total
        + signal.confidence,
      0,
    ) / available.length;

  const coverage =
    (
      available.length
      / signals.length
    ) * 100;

  return clamp(
    quality * 0.45
    + evidenceConfidence * 0.4
    + coverage * 0.15,
  );
};

const resolveTrend = (
  predictedRevenue: number,
  previousForecastRevenue?:
    number | null,
): SalesForecastTrend => {
  if (
    previousForecastRevenue === null
    || previousForecastRevenue
      === undefined
    || previousForecastRevenue <= 0
  ) {
    return "stable";
  }

  const deltaPercent =
    (
      predictedRevenue
      - previousForecastRevenue
    ) / previousForecastRevenue;

  if (deltaPercent >= 0.03) {
    return "improving";
  }

  if (deltaPercent <= -0.03) {
    return "declining";
  }

  return "stable";
};

const resolveHealth = (
  attainmentRate: number | undefined,
  coverageRatio: number | undefined,
  confidence: number,
  riskSummary: SalesForecastRiskSummary,
  configuration:
    SalesForecastConfiguration,
): SalesForecastHealth => {
  if (
    riskSummary.criticalRiskCount > 0
    && riskSummary.atRiskPredictedRevenue > 0
  ) {
    return "critical";
  }

  if (
    confidence < 45
    || (
      coverageRatio !== undefined
      && coverageRatio
        < configuration
          .watchCoverageThreshold
    )
    || (
      attainmentRate !== undefined
      && attainmentRate < 70
    )
  ) {
    return "at-risk";
  }

  if (
    confidence < 70
    || (
      coverageRatio !== undefined
      && coverageRatio
        < configuration
          .healthyCoverageThreshold
    )
  ) {
    return "watch";
  }

  return "healthy";
};

const buildExplanation = (
  forecast: {
    predictedRevenue: number;
    pipelineValue: number;
    quota?: number;
    attainmentRate?: number;
    coverageRatio?: number;
    confidence: number;
    trend: SalesForecastTrend;
    health: SalesForecastHealth;
    riskSummary: SalesForecastRiskSummary;
    signals:
      readonly SalesForecastSignalResult[];
  },
): SalesForecastExplanation => {
  const strongestSignals =
    [...forecast.signals]
      .filter(
        (signal) =>
          signal.available,
      )
      .sort(
        (left, right) =>
          right.weightedScore
          - left.weightedScore,
      )
      .slice(0, 4);

  const weakestSignals =
    [...forecast.signals]
      .filter(
        (signal) =>
          signal.available,
      )
      .sort(
        (left, right) =>
          left.score - right.score,
      )
      .slice(0, 4);

  const risks: string[] = [];

  if (
    forecast.riskSummary
      .criticalRiskCount > 0
  ) {
    risks.push(
      `${forecast.riskSummary.criticalRiskCount} critical-risk opportunities affect the forecast.`,
    );
  }

  if (
    forecast.riskSummary
      .atRiskPredictedRevenue > 0
  ) {
    risks.push(
      `${round(
        forecast.riskSummary
          .atRiskPredictedRevenue,
      )} of predicted revenue is exposed to high or critical risk.`,
    );
  }

  if (
    forecast.coverageRatio !== undefined
    && forecast.coverageRatio < 1
  ) {
    risks.push(
      `Forecast coverage is ${round(
        forecast.coverageRatio * 100,
      )}% of quota.`,
    );
  }

  const actions =
    weakestSignals.map(
      (signal) => {
        switch (signal.key) {
          case "commitCoverage":
            return "Increase committed revenue or create a documented gap-closure plan.";

          case "forecastRisk":
            return "Prioritize recovery plans for the largest at-risk opportunities.";

          case "pipelineConcentration":
            return "Reduce dependence on a small number of large opportunities.";

          case "closeDateQuality":
            return "Validate missing and unreliable opportunity close dates.";

          case "predictionConfidence":
            return "Improve opportunity evidence and prediction confidence.";

          case "dealMomentum":
            return "Restore momentum on declining opportunities.";

          case "historicalAttainment":
            return "Apply historical forecast bias when reviewing the current period.";

          default:
            return "Review weighted-pipeline quality and opportunity assumptions.";
        }
      },
    );

  return {
    summary:
      `Forecast health is ${forecast.health} with predicted revenue of ${round(
        forecast.predictedRevenue,
      )} and confidence of ${round(
        forecast.confidence,
      )}%.`,

    keyDrivers:
      strongestSignals.map(
        (signal) =>
          `${signal.label}: ${signal.reason}`,
      ),

    risks:
      risks.length > 0
        ? risks
        : [
            "No material aggregate forecast risk was detected.",
          ],

    actions:
      [...new Set(actions)],
  };
};

export class SalesForecastEngine {
  private readonly configuration:
    SalesForecastConfiguration;

  private readonly signals:
    readonly SalesForecastSignalDefinition[];

  constructor(
    configuration: Partial<
      SalesForecastConfiguration
    > = {},
    signals?: readonly SalesForecastSignalDefinition[],
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
      ?? createSalesForecastSignals(
        this.configuration.signalWeights,
      );
  }

  calculate(
    context: SalesForecastContext,
    calculatedAt = new Date(),
  ): SalesForecast {
    this.validateContext(context);

    const opportunityResults =
      buildOpportunityResults(context);

    const included =
      opportunityResults.filter(
        (result) =>
          result.includedInPeriod,
      );

    const pipelineValue =
      round(
        included.reduce(
          (total, result) =>
            total + result.dealValue,
          0,
        ),
      );

    const predictedRevenue =
      round(
        included.reduce(
          (total, result) =>
            total
            + result.predictedRevenue,
          0,
        ),
      );

    const weightedRevenue =
      round(
        included.reduce(
          (total, result) =>
            total
            + result.weightedRevenue,
          0,
        ),
      );

    const categorySummaries =
      buildCategorySummaries(
        opportunityResults,
        predictedRevenue,
      );

    const categoryRevenue = (
      category: SalesForecastCategory,
    ): number =>
      categorySummaries.find(
        (summary) =>
          summary.category === category,
      )?.predictedRevenue
      ?? 0;

    const commitRevenue =
      round(
        categoryRevenue("commit")
        + categoryRevenue("closed"),
      );

    const bestCaseRevenue =
      round(
        commitRevenue
        + categoryRevenue("best-case"),
      );

    const closedRevenue =
      round(
        categoryRevenue("closed"),
      );

    const attainmentRate =
      context.quota
      && context.quota > 0
        ? round(
            (
              predictedRevenue
              / context.quota
            ) * 100,
          )
        : undefined;

    const coverageRatio =
      context.quota
      && context.quota > 0
        ? round(
            pipelineValue
            / context.quota,
            4,
          )
        : undefined;

    const signalResults =
      this.signals.map(
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

    const confidence =
      round(
        calculateConfidence(
          signalResults,
        ),
      );

    const trend =
      resolveTrend(
        predictedRevenue,
        context.previousForecastRevenue,
      );

    const riskSummary =
      buildRiskSummary(
        opportunityResults,
      );

    const health =
      resolveHealth(
        attainmentRate,
        coverageRatio,
        confidence,
        riskSummary,
        this.configuration,
      );

    const baseForecast = {
      predictedRevenue,
      pipelineValue,
      quota: context.quota,
      attainmentRate,
      coverageRatio,
      confidence,
      trend,
      health,
      riskSummary,
      signals: signalResults,
    };

    return {
      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      currency:
        context.currency,

      period:
        context.period,

      periodStart:
        new Date(
          context.periodStart,
        ).toISOString(),

      periodEnd:
        new Date(
          context.periodEnd,
        ).toISOString(),

      pipelineValue,
      predictedRevenue,
      weightedRevenue,

      commitRevenue,
      bestCaseRevenue,
      closedRevenue,

      quota:
        context.quota,

      attainmentRate,
      coverageRatio,

      confidence,

      confidenceLevel:
        resolveConfidenceLevel(
          confidence,
        ),

      trend,
      health,

      opportunityCount:
        context.opportunities.length,

      includedOpportunityCount:
        included.length,

      categorySummaries,

      ownerSummaries:
        buildOwnerSummaries(
          opportunityResults,
        ),

      opportunityResults,

      riskSummary,

      signals:
        signalResults,

      explanation:
        buildExplanation(
          baseForecast,
        ),

      modelVersion:
        this.configuration.modelVersion,

      calculatedAt:
        calculatedAt.toISOString(),

      metadata: {
        previousForecastRevenue:
          context.previousForecastRevenue,

        previousForecastConfidence:
          context.previousForecastConfidence,

        historicalPeriodCount:
          context.historicalPerformance
            ?.length
          ?? 0,

        ...context.metadata,
      },
    };
  }

  private validateContext(
    context: SalesForecastContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Sales forecast requires a tenantId.",
      );
    }

    if (!context.currency.trim()) {
      throw new Error(
        "Sales forecast requires a currency.",
      );
    }

    const periodStart =
      new Date(context.periodStart);

    const periodEnd =
      new Date(context.periodEnd);

    if (
      Number.isNaN(periodStart.getTime())
      || Number.isNaN(periodEnd.getTime())
      || periodStart >= periodEnd
    ) {
      throw new Error(
        "Sales forecast requires a valid period range.",
      );
    }

    if (
      context.quota !== undefined
      && (
        !Number.isFinite(context.quota)
        || context.quota < 0
      )
    ) {
      throw new Error(
        "Sales forecast quota must be valid.",
      );
    }

    for (
      const opportunity
      of context.opportunities
    ) {
      if (
        opportunity.tenantId
        !== context.tenantId
      ) {
        throw new Error(
          "Sales forecast opportunity tenant mismatch.",
        );
      }

      if (
        opportunity.currency
        !== context.currency
      ) {
        throw new Error(
          "Sales forecast opportunities must use the forecast currency.",
        );
      }

      if (
        opportunity.opportunityScore
          .opportunityId
          !== opportunity.opportunityId
        || opportunity.winProbability
          .opportunityId
          !== opportunity.opportunityId
        || opportunity.revenuePrediction
          .opportunityId
          !== opportunity.opportunityId
      ) {
        throw new Error(
          "Sales forecast source opportunity mismatch.",
        );
      }

      if (
        opportunity.dealRisk
        && opportunity.dealRisk
          .opportunityId
          !== opportunity.opportunityId
      ) {
        throw new Error(
          "Sales forecast deal-risk opportunity mismatch.",
        );
      }
    }
  }
}

export const createSalesForecastEngine = (
  configuration: Partial<
    SalesForecastConfiguration
  > = {},
): SalesForecastEngine =>
  new SalesForecastEngine(
    configuration,
  );
