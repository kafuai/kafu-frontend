import {
  createRevenuePredictionProbabilityModel,
  resolveRevenuePredictionConfidence,
  resolveRevenuePredictionRiskLevel,
  resolveRevenuePredictionTrend,
} from "./RevenuePredictionModels";
import type {
  RevenuePredictionProbabilityModel,
} from "./RevenuePredictionModels";
import type {
  RevenuePredictionConfiguration,
  RevenuePredictionContext,
  RevenuePredictionDriver,
  RevenuePredictionForecast,
  RevenuePredictionOpportunityContribution,
  RevenuePredictionOpportunityInput,
  RevenuePredictionRisk,
  RevenuePredictionScenario,
  RevenuePredictionScenarioResult,
  RevenuePredictionSummary,
} from "./RevenuePredictionTypes";

const DEFAULT_CONFIGURATION:
  RevenuePredictionConfiguration = {
    modelVersion: "5.0.0",
    defaultCurrency: "USD",
    forecastTtlHours: 12,
    materialChangePercentage: 10,
    criticalTargetGapPercentage: 30,
    highTargetGapPercentage: 15,
    minimumConfidenceScore: 25,
    maximumHistoryEntries: 100,
  };

const roundMoney = (
  value: number,
): number =>
  Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;

const roundPercentage = (
  value: number,
): number =>
  Math.round(
    (value + Number.EPSILON) * 100,
  ) / 100;

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number =>
  Math.min(
    maximum,
    Math.max(minimum, value),
  );

export interface RevenuePredictionEngineDependencies {
  probabilityModel?:
    RevenuePredictionProbabilityModel;

  configuration?:
    Partial<RevenuePredictionConfiguration>;
}

export class RevenuePredictionEngine {
  private readonly probabilityModel:
    RevenuePredictionProbabilityModel;

  private readonly configuration:
    RevenuePredictionConfiguration;

  constructor(
    dependencies:
      RevenuePredictionEngineDependencies = {},
  ) {
    this.probabilityModel =
      dependencies.probabilityModel
      ?? createRevenuePredictionProbabilityModel();

    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...dependencies.configuration,
    };
  }

  generate(
    context: RevenuePredictionContext,
    generatedAt = new Date(),
  ): RevenuePredictionForecast {
    this.validateContext(context);

    const currency =
      context.currency
      ?? this.configuration.defaultCurrency;

    const expiresAt = new Date(
      generatedAt.getTime()
      + (
        this.configuration
          .forecastTtlHours
        * 60
        * 60
        * 1000
      ),
    );

    const contributions =
      context.opportunities.map(
        (opportunity) =>
          this.calculateContribution(
            context,
            opportunity,
            generatedAt,
          ),
      );

    const conservative =
      this.createScenario(
        "conservative",
        context,
        contributions,
      );

    const base =
      this.createScenario(
        "base",
        context,
        contributions,
      );

    const optimistic =
      this.createScenario(
        "optimistic",
        context,
        contributions,
      );

    const expectedRevenue =
      base.predictedRevenue;

    const confidenceScore =
      this.calculateForecastConfidence(
        context,
        contributions,
      );

    const confidence =
      resolveRevenuePredictionConfidence(
        confidenceScore,
      );

    const trendResolution =
      resolveRevenuePredictionTrend(
        expectedRevenue,
        context.previousForecast
          ?? context.previousActual,
      );

    const targetGap =
      context.revenueTarget === undefined
        ? undefined
        : roundMoney(
          context.revenueTarget
          - expectedRevenue,
        );

    const targetAttainmentPercentage =
      context.revenueTarget
        && context.revenueTarget > 0
        ? roundPercentage(
          (
            expectedRevenue
            / context.revenueTarget
          ) * 100,
        )
        : undefined;

    const drivers =
      this.buildDrivers(
        context,
        contributions,
      );

    const risks =
      this.buildRisks(
        context,
        contributions,
        expectedRevenue,
      );

    const summary =
      this.buildSummary(
        context,
        expectedRevenue,
        targetGap,
        targetAttainmentPercentage,
        drivers,
        risks,
      );

    const committedRevenue =
      roundMoney(
        contributions
          .filter(
            (item) =>
              item.includedInPeriod
              && (
                item.pipelineCategory
                  === "commit"
              ),
          )
          .reduce(
            (total, item) =>
              total + item.baseRevenue,
            0,
          ),
      );

    const bestCaseRevenue =
      roundMoney(
        contributions
          .filter(
            (item) =>
              item.includedInPeriod
              && (
                item.pipelineCategory
                  === "best-case"
              ),
          )
          .reduce(
            (total, item) =>
              total
              + item.optimisticRevenue,
            0,
          ),
      );

    return {
      id: "",

      tenantId: context.tenantId,
      workspaceId:
        context.workspaceId,

      horizon: context.horizon,
      periodStart:
        context.periodStart,
      periodEnd:
        context.periodEnd,

      currency,
      modelVersion:
        this.configuration.modelVersion,

      generatedAt:
        generatedAt.toISOString(),

      calculatedAt:
        generatedAt.toISOString(),

      expiresAt:
        expiresAt.toISOString(),

      conservative,
      base,
      optimistic,

      expectedRevenue,

      predictedRevenue:
        expectedRevenue,

      confidenceScore,
      confidence,

      trend:
        trendResolution.trend,
      trendPercentage:
        trendResolution.percentage,

      revenueTarget:
        context.revenueTarget,
      targetGap,
      targetAttainmentPercentage,

      totalPipelineValue:
        roundMoney(
          contributions.reduce(
            (total, item) =>
              total + item.amount,
            0,
          ),
        ),

      weightedPipelineValue:
        roundMoney(
          contributions.reduce(
            (total, item) =>
              total
              + item.weightedRevenue,
            0,
          ),
        ),

      committedRevenue,
      bestCaseRevenue,

      opportunityCount:
        contributions.length,

      includedOpportunityCount:
        contributions.filter(
          (item) =>
            item.includedInPeriod,
        ).length,

      excludedOpportunityCount:
        contributions.filter(
          (item) =>
            !item.includedInPeriod,
        ).length,

      contributions,
      drivers,
      risks,
      summary,

      explanation: {
        headline:
          summary.headline,

        narrative:
          summary.narrative,

        recommendation:
          risks[0]?.recommendedAction
          ?? summary.primaryDriver
          ?? "Continue monitoring forecast movement and opportunity evidence.",
      },

      riskLevel:
        risks.some(
          (risk) =>
            risk.level === "critical",
        )
          ? "critical"
          : risks.some(
            (risk) =>
              risk.level === "high",
          )
            ? "high"
            : risks.some(
              (risk) =>
                risk.level === "medium",
            )
              ? "medium"
              : "low",

      opportunityId:
        contributions.length === 1
          ? contributions[0]?.opportunityId
          : undefined,

      managementAttentionRequired:
        summary.targetStatus
          === "critical"
        || risks.some(
          (risk) =>
            risk.level === "critical",
        ),

      metadata:
        context.metadata,
    };
  }

  private calculateContribution(
    context: RevenuePredictionContext,
    opportunity:
      RevenuePredictionOpportunityInput,
    generatedAt: Date,
  ): RevenuePredictionOpportunityContribution {
    const inclusion =
      this.resolvePeriodInclusion(
        context,
        opportunity,
      );

    if (!opportunity.isOpen) {
      const wonRevenue =
        opportunity.isWon
          ? opportunity.amount
          : 0;

      return {
        opportunityId:
          opportunity.opportunityId,
        name: opportunity.name,
        ownerId: opportunity.ownerId,
        accountId:
          opportunity.accountId,

        amount:
          roundMoney(opportunity.amount),

        normalizedProbability:
          opportunity.isWon ? 1 : 0,

        weightedRevenue:
          roundMoney(wonRevenue),

        conservativeRevenue:
          roundMoney(wonRevenue),

        baseRevenue:
          roundMoney(wonRevenue),

        optimisticRevenue:
          roundMoney(wonRevenue),

        expectedCloseDate:
          opportunity.expectedCloseDate,

        stage: opportunity.stage,

        pipelineCategory:
          opportunity.pipelineCategory,

        riskAdjustment: 0,
        timingAdjustment: 0,
        activityAdjustment: 0,
        momentumAdjustment: 0,

        includedInPeriod:
          inclusion.included,

        exclusionReason:
          inclusion.reason,
      };
    }

    const model =
      this.probabilityModel.calculate({
        context,
        opportunity,
        generatedAt,
      });

    const amount =
      Math.max(
        0,
        opportunity.amount,
      );

    const weightedRevenue =
      inclusion.included
        ? amount * model.probability
        : 0;

    return {
      opportunityId:
        opportunity.opportunityId,
      name: opportunity.name,
      ownerId: opportunity.ownerId,
      accountId:
        opportunity.accountId,

      amount:
        roundMoney(amount),

      normalizedProbability:
        roundPercentage(
          model.probability * 100,
        ),

      weightedRevenue:
        roundMoney(weightedRevenue),

      conservativeRevenue:
        inclusion.included
          ? roundMoney(
            amount
            * model.conservativeMultiplier,
          )
          : 0,

      baseRevenue:
        inclusion.included
          ? roundMoney(
            amount
            * model.baseMultiplier,
          )
          : 0,

      optimisticRevenue:
        inclusion.included
          ? roundMoney(
            amount
            * model.optimisticMultiplier,
          )
          : 0,

      expectedCloseDate:
        opportunity.expectedCloseDate,

      stage: opportunity.stage,

      pipelineCategory:
        opportunity.committed
          ? "commit"
          : opportunity.bestCase
            ? "best-case"
            : opportunity.pipelineCategory,

      riskAdjustment:
        model.riskAdjustment,

      timingAdjustment:
        model.timingAdjustment,

      activityAdjustment:
        model.activityAdjustment,

      momentumAdjustment:
        model.momentumAdjustment,

      includedInPeriod:
        inclusion.included,

      exclusionReason:
        inclusion.reason,
    };
  }

  private createScenario(
    scenario:
      RevenuePredictionScenario,
    context: RevenuePredictionContext,
    contributions:
      readonly RevenuePredictionOpportunityContribution[],
  ): RevenuePredictionScenarioResult {
    const predictedRevenue =
      roundMoney(
        contributions.reduce(
          (total, item) => {
            if (!item.includedInPeriod) {
              return total;
            }

            switch (scenario) {
              case "conservative":
                return total
                  + item.conservativeRevenue;

              case "optimistic":
                return total
                  + item.optimisticRevenue;

              case "base":
              default:
                return total
                  + item.baseRevenue;
            }
          },
          0,
        ),
      );

    const targetGap =
      context.revenueTarget === undefined
        ? undefined
        : roundMoney(
          context.revenueTarget
          - predictedRevenue,
        );

    const targetAttainmentPercentage =
      context.revenueTarget
        && context.revenueTarget > 0
        ? roundPercentage(
          (
            predictedRevenue
            / context.revenueTarget
          ) * 100,
        )
        : undefined;

    const confidenceScore =
      this.calculateScenarioConfidence(
        context,
        contributions,
        scenario,
      );

    return {
      scenario,
      predictedRevenue,
      targetRevenue:
        context.revenueTarget,
      targetGap,
      targetAttainmentPercentage,

      confidenceScore,
      confidence:
        resolveRevenuePredictionConfidence(
          confidenceScore,
        ),

      openPipelineValue:
        roundMoney(
          contributions.reduce(
            (total, item) =>
              total
              + (
                item.includedInPeriod
                  ? item.amount
                  : 0
              ),
            0,
          ),
        ),

      weightedPipelineValue:
        roundMoney(
          contributions.reduce(
            (total, item) =>
              total
              + item.weightedRevenue,
            0,
          ),
        ),

      committedRevenue:
        roundMoney(
          contributions
            .filter(
              (item) =>
                item.includedInPeriod
                && item.pipelineCategory
                  === "commit",
            )
            .reduce(
              (total, item) =>
                total + item.baseRevenue,
              0,
            ),
        ),

      opportunityCount:
        contributions.length,

      includedOpportunityCount:
        contributions.filter(
          (item) =>
            item.includedInPeriod,
        ).length,
    };
  }

  private calculateForecastConfidence(
    context: RevenuePredictionContext,
    contributions:
      readonly RevenuePredictionOpportunityContribution[],
  ): number {
    if (contributions.length === 0) {
      return 0;
    }

    const included =
      contributions.filter(
        (item) =>
          item.includedInPeriod,
      );

    if (included.length === 0) {
      return 5;
    }

    const completeness =
      clamp(
        (
          included.filter(
            (item) =>
              Boolean(
                item.expectedCloseDate,
              ),
          ).length
          / included.length
        ) * 100,
        0,
        100,
      );

    const probabilityQuality =
      clamp(
        included.reduce(
          (total, item) =>
            total
            + (
              item.normalizedProbability
                >= 20
              && item.normalizedProbability
                <= 90
                ? 1
                : 0.6
            ),
          0,
        )
        / included.length
        * 100,
        0,
        100,
      );

    const concentration =
      this.calculateConcentrationScore(
        included,
      );

    const historyStrength =
      context.historicalActuals
        ?.length
        ? clamp(
          context.historicalActuals.length
          * 12,
          0,
          100,
        )
        : 25;

    return roundPercentage(
      clamp(
        (
          completeness * 0.3
          + probabilityQuality * 0.3
          + concentration * 0.2
          + historyStrength * 0.2
        ),
        0,
        100,
      ),
    );
  }

  private calculateScenarioConfidence(
    context: RevenuePredictionContext,
    contributions:
      readonly RevenuePredictionOpportunityContribution[],
    scenario:
      RevenuePredictionScenario,
  ): number {
    const base =
      this.calculateForecastConfidence(
        context,
        contributions,
      );

    switch (scenario) {
      case "conservative":
        return roundPercentage(
          clamp(base + 5, 0, 100),
        );

      case "optimistic":
        return roundPercentage(
          clamp(base - 12, 0, 100),
        );

      case "base":
      default:
        return base;
    }
  }

  private calculateConcentrationScore(
    contributions:
      readonly RevenuePredictionOpportunityContribution[],
  ): number {
    const total =
      contributions.reduce(
        (sum, item) =>
          sum + item.amount,
        0,
      );

    if (total <= 0) {
      return 0;
    }

    const largest =
      Math.max(
        ...contributions.map(
          (item) => item.amount,
        ),
      );

    const concentration =
      largest / total;

    return roundPercentage(
      clamp(
        (1 - concentration) * 125,
        0,
        100,
      ),
    );
  }

  private buildDrivers(
    context: RevenuePredictionContext,
    contributions:
      readonly RevenuePredictionOpportunityContribution[],
  ): readonly RevenuePredictionDriver[] {
    const drivers:
      RevenuePredictionDriver[] = [];

    const committed =
      contributions.filter(
        (item) =>
          item.includedInPeriod
          && item.pipelineCategory
            === "commit",
      );

    const highProbability =
      contributions.filter(
        (item) =>
          item.includedInPeriod
          && item.normalizedProbability
            >= 70,
      );

    const activeMomentum =
      contributions.filter(
        (item) =>
          item.includedInPeriod
          && item.momentumAdjustment > 0,
      );

    if (committed.length > 0) {
      drivers.push({
        key: "committed-pipeline",
        label: "Committed pipeline",
        impact: "positive",
        weight:
          committed.length,
        description:
          "Committed opportunities provide direct support for the base forecast.",
        evidence:
          committed.map(
            (item) =>
              `${item.opportunityId}:${item.baseRevenue}`,
          ),
      });
    }

    if (highProbability.length > 0) {
      drivers.push({
        key: "high-probability-opportunities",
        label:
          "High-probability opportunities",
        impact: "positive",
        weight:
          highProbability.length,
        description:
          "Multiple opportunities have strong normalized win probabilities.",
        evidence:
          highProbability.map(
            (item) =>
              `${item.opportunityId}:${item.normalizedProbability}%`,
          ),
      });
    }

    if (activeMomentum.length > 0) {
      drivers.push({
        key: "positive-momentum",
        label: "Positive deal momentum",
        impact: "positive",
        weight:
          activeMomentum.length,
        description:
          "Recent opportunity momentum is improving the expected revenue outcome.",
        evidence:
          activeMomentum.map(
            (item) =>
              item.opportunityId,
          ),
      });
    }

    if (
      context.previousForecast
      && context.previousForecast > 0
    ) {
      const current =
        contributions.reduce(
          (total, item) =>
            total + item.baseRevenue,
          0,
        );

      const change =
        (
          (
            current
            - context.previousForecast
          )
          / context.previousForecast
        ) * 100;

      drivers.push({
        key: "forecast-movement",
        label: "Forecast movement",
        impact:
          change > 3
            ? "positive"
            : change < -3
              ? "negative"
              : "neutral",
        weight:
          Math.abs(
            roundPercentage(change),
          ),
        description:
          `The base forecast changed by ${roundPercentage(change)}% versus the previous forecast.`,
        evidence: [
          `previous:${context.previousForecast}`,
          `current:${roundMoney(current)}`,
        ],
      });
    }

    return drivers
      .sort(
        (left, right) =>
          right.weight - left.weight,
      )
      .slice(0, 8);
  }

  private buildRisks(
    context: RevenuePredictionContext,
    contributions:
      readonly RevenuePredictionOpportunityContribution[],
    expectedRevenue: number,
  ): readonly RevenuePredictionRisk[] {
    const risks:
      RevenuePredictionRisk[] = [];

    const stale =
      contributions.filter(
        (item) =>
          item.includedInPeriod
          && item.activityAdjustment
            <= -0.18,
      );

    if (stale.length > 0) {
      const impact =
        stale.reduce(
          (total, item) =>
            total + item.baseRevenue,
          0,
        );

      risks.push({
        key: "stale-opportunities",
        level:
          resolveRevenuePredictionRiskLevel(
            Math.min(
              100,
              stale.length * 18,
            ),
          ),
        title:
          "Revenue exposed to stale opportunities",
        description:
          "A portion of forecast revenue depends on opportunities with extended inactivity.",
        impactAmount:
          roundMoney(impact),
        opportunityIds:
          stale.map(
            (item) =>
              item.opportunityId,
          ),
        recommendedAction:
          "Require immediate owner follow-up and confirm close-date validity.",
      });
    }

    const highRisk =
      contributions.filter(
        (item) =>
          item.includedInPeriod
          && item.riskAdjustment
            <= -0.2,
      );

    if (highRisk.length > 0) {
      risks.push({
        key: "high-risk-pipeline",
        level:
          highRisk.length >= 3
            ? "critical"
            : "high",
        title:
          "High-risk pipeline concentration",
        description:
          "Several forecasted opportunities carry significant risk deductions.",
        impactAmount:
          roundMoney(
            highRisk.reduce(
              (total, item) =>
                total
                + item.baseRevenue,
              0,
            ),
          ),
        opportunityIds:
          highRisk.map(
            (item) =>
              item.opportunityId,
          ),
        recommendedAction:
          "Review blockers, decision criteria, stakeholders, and competitive exposure.",
      });
    }

    const included =
      contributions.filter(
        (item) =>
          item.includedInPeriod,
      );

    if (included.length > 0) {
      const largest =
        included.reduce(
          (current, item) =>
            item.baseRevenue
              > current.baseRevenue
              ? item
              : current,
        );

      const concentration =
        expectedRevenue > 0
          ? (
            largest.baseRevenue
            / expectedRevenue
          ) * 100
          : 0;

      if (concentration >= 40) {
        risks.push({
          key: "revenue-concentration",
          level:
            concentration >= 65
              ? "critical"
              : "high",
          title:
            "Forecast concentration risk",
          description:
            "The forecast depends heavily on a single opportunity.",
          impactAmount:
            largest.baseRevenue,
          impactPercentage:
            roundPercentage(
              concentration,
            ),
          opportunityIds: [
            largest.opportunityId,
          ],
          recommendedAction:
            "Create an executive close plan and strengthen alternative pipeline coverage.",
        });
      }
    }

    if (
      context.revenueTarget
      && context.revenueTarget > 0
    ) {
      const gap =
        context.revenueTarget
        - expectedRevenue;

      const gapPercentage =
        gap > 0
          ? (
            gap
            / context.revenueTarget
          ) * 100
          : 0;

      if (
        gapPercentage
        >= this.configuration
          .highTargetGapPercentage
      ) {
        risks.push({
          key: "target-gap",
          level:
            gapPercentage
              >= this.configuration
                .criticalTargetGapPercentage
              ? "critical"
              : "high",
          title:
            "Revenue target at risk",
          description:
            "The base forecast is materially below the configured revenue target.",
          impactAmount:
            roundMoney(gap),
          impactPercentage:
            roundPercentage(
              gapPercentage,
            ),
          recommendedAction:
            "Accelerate committed deals, create recovery pipeline, and revalidate forecast assumptions.",
        });
      }
    }

    return risks
      .sort(
        (left, right) => {
          const severity = {
            critical: 4,
            high: 3,
            medium: 2,
            low: 1,
          };

          return (
            severity[right.level]
            - severity[left.level]
          );
        },
      )
      .slice(0, 10);
  }

  private buildSummary(
    context: RevenuePredictionContext,
    expectedRevenue: number,
    targetGap: number | undefined,
    targetAttainmentPercentage:
      number | undefined,
    drivers:
      readonly RevenuePredictionDriver[],
    risks:
      readonly RevenuePredictionRisk[],
  ): RevenuePredictionSummary {
    let targetStatus:
      RevenuePredictionSummary["targetStatus"];

    if (
      context.revenueTarget === undefined
    ) {
      targetStatus =
        "not-configured";
    } else if (
      targetAttainmentPercentage
      === undefined
    ) {
      targetStatus = "at-risk";
    } else if (
      targetAttainmentPercentage >= 105
    ) {
      targetStatus =
        "above-target";
    } else if (
      targetAttainmentPercentage >= 95
    ) {
      targetStatus = "on-track";
    } else if (
      targetAttainmentPercentage >= 75
    ) {
      targetStatus = "at-risk";
    } else {
      targetStatus = "critical";
    }

    const headline =
      targetStatus === "above-target"
        ? "Revenue forecast is above target."
        : targetStatus === "on-track"
          ? "Revenue forecast is currently on track."
          : targetStatus === "at-risk"
            ? "Revenue forecast requires corrective action."
            : targetStatus === "critical"
              ? "Revenue target is critically exposed."
              : "Revenue forecast generated without a configured target.";

    const narrativeParts = [
      `Expected revenue is ${roundMoney(expectedRevenue)}.`,
    ];

    if (
      context.revenueTarget
      !== undefined
    ) {
      narrativeParts.push(
        `Target revenue is ${roundMoney(context.revenueTarget)}.`,
      );
    }

    if (
      targetGap !== undefined
      && targetGap > 0
    ) {
      narrativeParts.push(
        `The forecast gap is ${roundMoney(targetGap)}.`,
      );
    }

    if (drivers[0]) {
      narrativeParts.push(
        `Primary driver: ${drivers[0].label}.`,
      );
    }

    if (risks[0]) {
      narrativeParts.push(
        `Primary risk: ${risks[0].title}.`,
      );
    }

    return {
      headline,
      narrative:
        narrativeParts.join(" "),
      targetStatus,
      primaryDriver:
        drivers[0]?.label,
      primaryRisk:
        risks[0]?.title,
    };
  }

  private resolvePeriodInclusion(
    context: RevenuePredictionContext,
    opportunity:
      RevenuePredictionOpportunityInput,
  ): {
    included: boolean;
    reason?: string;
  } {
    if (
      opportunity.isLost
      || (
        !opportunity.isOpen
        && !opportunity.isWon
      )
    ) {
      return {
        included: false,
        reason:
          "Opportunity is closed without recognized revenue.",
      };
    }

    if (
      opportunity.pipelineCategory
      === "omitted"
    ) {
      return {
        included: false,
        reason:
          "Opportunity is omitted from the forecast.",
      };
    }

    if (!opportunity.expectedCloseDate) {
      return {
        included: false,
        reason:
          "Expected close date is missing.",
      };
    }

    const closeDate =
      new Date(
        opportunity.expectedCloseDate,
      );

    const periodStart =
      new Date(context.periodStart);

    const periodEnd =
      new Date(context.periodEnd);

    if (
      Number.isNaN(closeDate.getTime())
    ) {
      return {
        included: false,
        reason:
          "Expected close date is invalid.",
      };
    }

    if (
      closeDate < periodStart
      || closeDate > periodEnd
    ) {
      return {
        included: false,
        reason:
          "Expected close date falls outside the forecast period.",
      };
    }

    return {
      included: true,
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

    const periodStart =
      new Date(context.periodStart);

    const periodEnd =
      new Date(context.periodEnd);

    if (
      Number.isNaN(
        periodStart.getTime(),
      )
    ) {
      throw new Error(
        "Revenue prediction periodStart is invalid.",
      );
    }

    if (
      Number.isNaN(
        periodEnd.getTime(),
      )
    ) {
      throw new Error(
        "Revenue prediction periodEnd is invalid.",
      );
    }

    if (periodEnd <= periodStart) {
      throw new Error(
        "Revenue prediction periodEnd must be after periodStart.",
      );
    }

    if (
      context.revenueTarget
        !== undefined
      && (
        !Number.isFinite(
          context.revenueTarget,
        )
        || context.revenueTarget < 0
      )
    ) {
      throw new Error(
        "Revenue target must be a non-negative finite number.",
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
          `Opportunity "${opportunity.opportunityId}" belongs to another tenant.`,
        );
      }

      if (
        context.workspaceId
        && opportunity.workspaceId
        && opportunity.workspaceId
          !== context.workspaceId
      ) {
        throw new Error(
          `Opportunity "${opportunity.opportunityId}" belongs to another workspace.`,
        );
      }

      if (
        !Number.isFinite(
          opportunity.amount,
        )
        || opportunity.amount < 0
      ) {
        throw new Error(
          `Opportunity "${opportunity.opportunityId}" has an invalid amount.`,
        );
      }
    }
  }
}

export const createRevenuePredictionEngine = (
  dependencies:
    RevenuePredictionEngineDependencies = {},
): RevenuePredictionEngine =>
  new RevenuePredictionEngine(
    dependencies,
  );

