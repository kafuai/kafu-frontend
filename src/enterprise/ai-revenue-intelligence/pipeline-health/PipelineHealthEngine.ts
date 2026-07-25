import {
  averagePipelineHealthValue,
  clampPipelineHealthScore,
  resolveOpportunityDaysInStage,
  resolveOpportunityInactivityDays,
  resolvePipelineHealthGrade,
  resolvePipelineHealthRiskLevel,
  resolvePipelineHealthTrend,
  resolvePipelineWeightedAmount,
  roundPipelineHealthNumber,
} from "./PipelineHealthMetrics";
import type {
  PipelineHealthAssessment,
  PipelineHealthBottleneck,
  PipelineHealthConfiguration,
  PipelineHealthContext,
  PipelineHealthDimension,
  PipelineHealthDimensionScore,
  PipelineHealthOpportunityInput,
  PipelineHealthOwnerAnalysis,
  PipelineHealthRecommendation,
  PipelineHealthRisk,
  PipelineHealthStageAnalysis,
  PipelineHealthSummary,
} from "./PipelineHealthTypes";

const DEFAULT_CONFIGURATION:
  PipelineHealthConfiguration = {
    modelVersion: "5.0.0",
    assessmentTtlHours: 12,

    excellentThreshold: 85,
    healthyThreshold: 70,
    watchThreshold: 55,
    atRiskThreshold: 40,

    minimumCoverageRatio: 1,
    healthyCoverageRatio: 2.5,
    excellentCoverageRatio: 4,

    staleActivityDays: 14,
    criticalActivityDays: 30,

    slowStageDays: 21,
    criticalStageDays: 45,

    materialScoreChange: 10,

    concentrationRiskPercentage: 40,
    criticalConcentrationPercentage: 65,
  };

const DIMENSION_WEIGHTS:
  Readonly<Record<
    PipelineHealthDimension,
    number
  >> = {
    coverage: 0.18,
    quality: 0.18,
    velocity: 0.14,
    conversion: 0.12,
    concentration: 0.1,
    activity: 0.12,
    "stage-balance": 0.08,
    "forecast-alignment": 0.08,
  };

export interface PipelineHealthEngineDependencies {
  configuration?:
    Partial<PipelineHealthConfiguration>;
}

export class PipelineHealthEngine {
  private readonly configuration:
    PipelineHealthConfiguration;

  constructor(
    dependencies:
      PipelineHealthEngineDependencies = {},
  ) {
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...dependencies.configuration,
    };
  }

  generate(
    context: PipelineHealthContext,
    generatedAt = new Date(),
  ): PipelineHealthAssessment {
    this.validateContext(context);

    const openOpportunities =
      context.opportunities.filter(
        (opportunity) =>
          opportunity.isOpen,
      );

    const openPipelineValue =
      roundPipelineHealthNumber(
        openOpportunities.reduce(
          (total, opportunity) =>
            total
            + Math.max(
              0,
              opportunity.amount,
            ),
          0,
        ),
      );

    const weightedPipelineValue =
      roundPipelineHealthNumber(
        openOpportunities.reduce(
          (total, opportunity) =>
            total
            + resolvePipelineWeightedAmount(
              opportunity,
            ),
          0,
        ),
      );

    const committedPipelineValue =
      roundPipelineHealthNumber(
        openOpportunities
          .filter(
            (opportunity) =>
              opportunity.committed,
          )
          .reduce(
            (total, opportunity) =>
              total
              + resolvePipelineWeightedAmount(
                opportunity,
              ),
            0,
          ),
      );

    const bestCasePipelineValue =
      roundPipelineHealthNumber(
        openOpportunities
          .filter(
            (opportunity) =>
              opportunity.bestCase,
          )
          .reduce(
            (total, opportunity) =>
              total
              + resolvePipelineWeightedAmount(
                opportunity,
              ),
            0,
          ),
      );

    const coverageRatio =
      context.revenueTarget
      && context.revenueTarget > 0
        ? roundPipelineHealthNumber(
          openPipelineValue
          / context.revenueTarget,
        )
        : undefined;

    const pipelineGap =
      context.revenueTarget
      && context.revenueTarget > 0
        ? roundPipelineHealthNumber(
          Math.max(
            0,
            context.revenueTarget
            - weightedPipelineValue,
          ),
        )
        : undefined;

    const staleOpportunities =
      openOpportunities.filter(
        (opportunity) =>
          resolveOpportunityInactivityDays(
            opportunity,
            generatedAt,
          )
          >= this.configuration
            .staleActivityDays,
      );

    const criticalOpportunities =
      openOpportunities.filter(
        (opportunity) =>
          resolveOpportunityInactivityDays(
            opportunity,
            generatedAt,
          )
          >= this.configuration
            .criticalActivityDays
          || resolveOpportunityDaysInStage(
            opportunity,
            generatedAt,
          )
          >= this.configuration
            .criticalStageDays
          || (
            opportunity.riskScore
            ?? 0
          ) >= 80,
      );

    const overdueActionCount =
      openOpportunities.reduce(
        (total, opportunity) =>
          total
          + Math.max(
            0,
            opportunity.overdueActionCount
            ?? 0,
          ),
        0,
      );

    const dimensions =
      this.buildDimensions(
        context,
        openOpportunities,
        generatedAt,
        coverageRatio,
      );

    const healthScore =
      roundPipelineHealthNumber(
        clampPipelineHealthScore(
          dimensions.reduce(
            (total, dimension) =>
              total
              + dimension.weightedScore,
            0,
          ),
        ),
      );

    const grade =
      resolvePipelineHealthGrade(
        healthScore,
        this.configuration,
      );

    const previousScore =
      context.historicalSnapshots
        ?.slice()
        .sort(
          (left, right) =>
            new Date(
              right.assessedAt,
            ).getTime()
            - new Date(
              left.assessedAt,
            ).getTime(),
        )[0]
        ?.healthScore;

    const trendResolution =
      resolvePipelineHealthTrend(
        healthScore,
        previousScore,
      );

    const stages =
      this.buildStageAnalysis(
        context,
        openOpportunities,
        generatedAt,
      );

    const owners =
      this.buildOwnerAnalysis(
        openOpportunities,
        generatedAt,
      );

    const bottlenecks =
      this.buildBottlenecks(
        stages,
        owners,
        openOpportunities,
        generatedAt,
      );

    const risks =
      this.buildRisks(
        context,
        openOpportunities,
        dimensions,
        coverageRatio,
        weightedPipelineValue,
        generatedAt,
      );

    const recommendations =
      this.buildRecommendations(
        risks,
        bottlenecks,
      );

    const summary =
      this.buildSummary(
        healthScore,
        grade,
        dimensions,
        risks,
        recommendations,
      );

    const expiresAt =
      new Date(
        generatedAt.getTime()
        + (
          this.configuration
            .assessmentTtlHours
          * 60
          * 60
          * 1000
        ),
      );

    return {
      id: "",

      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      periodStart:
        context.periodStart,

      periodEnd:
        context.periodEnd,

      modelVersion:
        this.configuration.modelVersion,

      generatedAt:
        generatedAt.toISOString(),

      expiresAt:
        expiresAt.toISOString(),

      healthScore,
      grade,

      trend:
        trendResolution.trend,

      trendPercentage:
        trendResolution.percentage,

      revenueTarget:
        context.revenueTarget,

      revenueForecast:
        context.revenueForecast,

      coverageRatio,
      pipelineGap,

      openPipelineValue,
      weightedPipelineValue,
      committedPipelineValue,
      bestCasePipelineValue,

      opportunityCount:
        context.opportunities.length,

      openOpportunityCount:
        openOpportunities.length,

      wonOpportunityCount:
        context.opportunities.filter(
          (opportunity) =>
            opportunity.isWon,
        ).length,

      lostOpportunityCount:
        context.opportunities.filter(
          (opportunity) =>
            opportunity.isLost,
        ).length,

      staleOpportunityCount:
        staleOpportunities.length,

      criticalOpportunityCount:
        criticalOpportunities.length,

      overdueActionCount,

      dimensions,
      stages,
      owners,
      bottlenecks,
      risks,
      recommendations,
      summary,

      managementAttentionRequired:
        grade === "critical"
        || grade === "at-risk"
        || risks.some(
          (risk) =>
            risk.level === "critical",
        ),

      metadata:
        context.metadata,
    };
  }

  private buildDimensions(
    context: PipelineHealthContext,
    opportunities:
      readonly PipelineHealthOpportunityInput[],
    generatedAt: Date,
    coverageRatio?: number,
  ): readonly PipelineHealthDimensionScore[] {
    const rawScores:
      Record<
        PipelineHealthDimension,
        {
          score: number;
          summary: string;
          evidence: string[];
        }
      > = {
        coverage:
          this.calculateCoverageScore(
            context,
            coverageRatio,
          ),

        quality:
          this.calculateQualityScore(
            opportunities,
          ),

        velocity:
          this.calculateVelocityScore(
            opportunities,
            generatedAt,
          ),

        conversion:
          this.calculateConversionScore(
            context,
          ),

        concentration:
          this.calculateConcentrationScore(
            opportunities,
          ),

        activity:
          this.calculateActivityScore(
            opportunities,
            generatedAt,
          ),

        "stage-balance":
          this.calculateStageBalanceScore(
            opportunities,
          ),

        "forecast-alignment":
          this.calculateForecastAlignmentScore(
            context,
            opportunities,
          ),
      };

    return (
      Object.entries(
        DIMENSION_WEIGHTS,
      ) as Array<
        [
          PipelineHealthDimension,
          number,
        ]
      >
    ).map(
      ([dimension, weight]) => {
        const raw =
          rawScores[dimension];

        const score =
          roundPipelineHealthNumber(
            clampPipelineHealthScore(
              raw.score,
            ),
          );

        return {
          dimension,
          score,
          weight,
          weightedScore:
            roundPipelineHealthNumber(
              score * weight,
            ),

          grade:
            resolvePipelineHealthGrade(
              score,
              this.configuration,
            ),

          summary:
            raw.summary,

          evidence:
            raw.evidence,
        };
      },
    );
  }

  private calculateCoverageScore(
    context: PipelineHealthContext,
    coverageRatio?: number,
  ): {
    score: number;
    summary: string;
    evidence: string[];
  } {
    if (
      context.revenueTarget === undefined
      || coverageRatio === undefined
    ) {
      return {
        score: 55,
        summary:
          "Coverage cannot be fully evaluated because no revenue target is configured.",
        evidence: [
          "revenue-target:not-configured",
        ],
      };
    }

    let score: number;

    if (
      coverageRatio
      >= this.configuration
        .excellentCoverageRatio
    ) {
      score = 95;
    } else if (
      coverageRatio
      >= this.configuration
        .healthyCoverageRatio
    ) {
      score = 80;
    } else if (
      coverageRatio
      >= this.configuration
        .minimumCoverageRatio
    ) {
      score = 58;
    } else {
      score =
        Math.max(
          0,
          coverageRatio * 45,
        );
    }

    return {
      score,
      summary:
        `Pipeline coverage is ${roundPipelineHealthNumber(coverageRatio)}x the configured revenue target.`,
      evidence: [
        `coverage-ratio:${roundPipelineHealthNumber(coverageRatio)}`,
        `target:${context.revenueTarget}`,
      ],
    };
  }

  private calculateQualityScore(
    opportunities:
      readonly PipelineHealthOpportunityInput[],
  ): {
    score: number;
    summary: string;
    evidence: string[];
  } {
    if (opportunities.length === 0) {
      return {
        score: 0,
        summary:
          "No open opportunities are available for quality analysis.",
        evidence: [
          "open-opportunities:0",
        ],
      };
    }

    const qualityValues =
      opportunities.map(
        (opportunity) => {
          const opportunityScore =
            opportunity.opportunityScore
            ?? opportunity.healthScore
            ?? 50;

          const riskPenalty =
            (
              opportunity.riskScore
              ?? 30
            ) * 0.35;

          const probabilitySupport =
            (
              opportunity.winProbability
              ?? opportunity.stageProbability
              ?? 50
            ) * 0.35;

          return (
            opportunityScore * 0.65
            + probabilitySupport
            - riskPenalty
          );
        },
      );

    const score =
      clampPipelineHealthScore(
        averagePipelineHealthValue(
          qualityValues,
        ),
      );

    return {
      score,
      summary:
        "Pipeline quality reflects opportunity scores, probabilities, and risk exposure.",
      evidence: [
        `average-quality:${roundPipelineHealthNumber(score)}`,
        `opportunities:${opportunities.length}`,
      ],
    };
  }

  private calculateVelocityScore(
    opportunities:
      readonly PipelineHealthOpportunityInput[],
    generatedAt: Date,
  ): {
    score: number;
    summary: string;
    evidence: string[];
  } {
    if (opportunities.length === 0) {
      return {
        score: 0,
        summary:
          "No open opportunities are available for velocity analysis.",
        evidence: [
          "open-opportunities:0",
        ],
      };
    }

    const averageDays =
      averagePipelineHealthValue(
        opportunities.map(
          (opportunity) =>
            resolveOpportunityDaysInStage(
              opportunity,
              generatedAt,
            ),
        ),
      );

    let score = 100;

    if (
      averageDays
      >= this.configuration
        .criticalStageDays
    ) {
      score = 20;
    } else if (
      averageDays
      >= this.configuration
        .slowStageDays
    ) {
      score = 50;
    } else if (averageDays >= 14) {
      score = 70;
    } else if (averageDays >= 7) {
      score = 85;
    }

    return {
      score,
      summary:
        `Average pipeline stage age is ${roundPipelineHealthNumber(averageDays)} days.`,
      evidence: [
        `average-days-in-stage:${roundPipelineHealthNumber(averageDays)}`,
      ],
    };
  }

  private calculateConversionScore(
    context: PipelineHealthContext,
  ): {
    score: number;
    summary: string;
    evidence: string[];
  } {
    const closed =
      context.opportunities.filter(
        (opportunity) =>
          opportunity.isWon
          || opportunity.isLost,
      );

    if (closed.length === 0) {
      return {
        score: 55,
        summary:
          "Insufficient closed-opportunity data is available for conversion analysis.",
        evidence: [
          "closed-opportunities:0",
        ],
      };
    }

    const won =
      closed.filter(
        (opportunity) =>
          opportunity.isWon,
      );

    const conversionRate =
      (
        won.length
        / closed.length
      ) * 100;

    return {
      score:
        clampPipelineHealthScore(
          conversionRate * 1.35,
        ),

      summary:
        `Observed conversion rate is ${roundPipelineHealthNumber(conversionRate)}%.`,

      evidence: [
        `won:${won.length}`,
        `closed:${closed.length}`,
        `conversion-rate:${roundPipelineHealthNumber(conversionRate)}`,
      ],
    };
  }

  private calculateConcentrationScore(
    opportunities:
      readonly PipelineHealthOpportunityInput[],
  ): {
    score: number;
    summary: string;
    evidence: string[];
  } {
    const total =
      opportunities.reduce(
        (sum, opportunity) =>
          sum
          + Math.max(
            0,
            opportunity.amount,
          ),
        0,
      );

    if (total <= 0) {
      return {
        score: 0,
        summary:
          "Pipeline concentration cannot be evaluated because open pipeline value is zero.",
        evidence: [
          "pipeline-value:0",
        ],
      };
    }

    const largest =
      Math.max(
        ...opportunities.map(
          (opportunity) =>
            Math.max(
              0,
              opportunity.amount,
            ),
        ),
      );

    const concentration =
      (
        largest
        / total
      ) * 100;

    const score =
      clampPipelineHealthScore(
        110
        - concentration * 1.35,
      );

    return {
      score,
      summary:
        `The largest opportunity represents ${roundPipelineHealthNumber(concentration)}% of open pipeline value.`,
      evidence: [
        `largest-opportunity-share:${roundPipelineHealthNumber(concentration)}`,
      ],
    };
  }

  private calculateActivityScore(
    opportunities:
      readonly PipelineHealthOpportunityInput[],
    generatedAt: Date,
  ): {
    score: number;
    summary: string;
    evidence: string[];
  } {
    if (opportunities.length === 0) {
      return {
        score: 0,
        summary:
          "No open opportunities are available for activity analysis.",
        evidence: [
          "open-opportunities:0",
        ],
      };
    }

    const inactivityDays =
      opportunities.map(
        (opportunity) =>
          resolveOpportunityInactivityDays(
            opportunity,
            generatedAt,
          ),
      );

    const staleCount =
      inactivityDays.filter(
        (days) =>
          days
          >= this.configuration
            .staleActivityDays,
      ).length;

    const criticalCount =
      inactivityDays.filter(
        (days) =>
          days
          >= this.configuration
            .criticalActivityDays,
      ).length;

    const staleRatio =
      staleCount
      / opportunities.length;

    const criticalRatio =
      criticalCount
      / opportunities.length;

    const score =
      clampPipelineHealthScore(
        100
        - staleRatio * 55
        - criticalRatio * 45,
      );

    return {
      score,
      summary:
        `${staleCount} open opportunities are stale and ${criticalCount} are critically inactive.`,
      evidence: [
        `stale:${staleCount}`,
        `critical:${criticalCount}`,
        `open:${opportunities.length}`,
      ],
    };
  }

  private calculateStageBalanceScore(
    opportunities:
      readonly PipelineHealthOpportunityInput[],
  ): {
    score: number;
    summary: string;
    evidence: string[];
  } {
    if (opportunities.length === 0) {
      return {
        score: 0,
        summary:
          "No open opportunities are available for stage-balance analysis.",
        evidence: [
          "open-opportunities:0",
        ],
      };
    }

    const stageCounts =
      new Map<string, number>();

    for (
      const opportunity
      of opportunities
    ) {
      stageCounts.set(
        opportunity.stage,
        (
          stageCounts.get(
            opportunity.stage,
          )
          ?? 0
        ) + 1,
      );
    }

    const largestStageCount =
      Math.max(
        ...stageCounts.values(),
      );

    const concentration =
      largestStageCount
      / opportunities.length;

    const stageDiversity =
      Math.min(
        1,
        stageCounts.size / 5,
      );

    const score =
      clampPipelineHealthScore(
        (
          1 - concentration
        ) * 65
        + stageDiversity * 35,
      );

    return {
      score,
      summary:
        `Open pipeline is distributed across ${stageCounts.size} stages.`,
      evidence: [
        `stages:${stageCounts.size}`,
        `largest-stage-share:${roundPipelineHealthNumber(concentration * 100)}`,
      ],
    };
  }

  private calculateForecastAlignmentScore(
    context: PipelineHealthContext,
    opportunities:
      readonly PipelineHealthOpportunityInput[],
  ): {
    score: number;
    summary: string;
    evidence: string[];
  } {
    if (
      context.revenueForecast
      === undefined
    ) {
      return {
        score: 55,
        summary:
          "Forecast alignment cannot be fully measured because no revenue forecast is provided.",
        evidence: [
          "revenue-forecast:not-configured",
        ],
      };
    }

    const weightedPipeline =
      opportunities.reduce(
        (total, opportunity) =>
          total
          + resolvePipelineWeightedAmount(
            opportunity,
          ),
        0,
      );

    if (
      context.revenueForecast === 0
      && weightedPipeline === 0
    ) {
      return {
        score: 100,
        summary:
          "Weighted pipeline and revenue forecast are aligned at zero.",
        evidence: [
          "forecast:0",
          "weighted-pipeline:0",
        ],
      };
    }

    const denominator =
      Math.max(
        1,
        Math.abs(
          context.revenueForecast,
        ),
      );

    const variancePercentage =
      (
        Math.abs(
          weightedPipeline
          - context.revenueForecast,
        )
        / denominator
      ) * 100;

    const score =
      clampPipelineHealthScore(
        100
        - variancePercentage,
      );

    return {
      score,
      summary:
        `Weighted pipeline differs from the revenue forecast by ${roundPipelineHealthNumber(variancePercentage)}%.`,
      evidence: [
        `forecast:${context.revenueForecast}`,
        `weighted-pipeline:${roundPipelineHealthNumber(weightedPipeline)}`,
      ],
    };
  }

  private buildStageAnalysis(
    context: PipelineHealthContext,
    opportunities:
      readonly PipelineHealthOpportunityInput[],
    generatedAt: Date,
  ): readonly PipelineHealthStageAnalysis[] {
    const grouped =
      new Map<
        string,
        PipelineHealthOpportunityInput[]
      >();

    for (
      const opportunity
      of opportunities
    ) {
      const existing =
        grouped.get(
          opportunity.stage,
        )
        ?? [];

      existing.push(
        opportunity,
      );

      grouped.set(
        opportunity.stage,
        existing,
      );
    }

    const results:
      PipelineHealthStageAnalysis[] = [];

    for (
      const [stage, items]
      of grouped
    ) {
      const benchmark =
        context.stageBenchmarks
          ?.find(
            (item) =>
              item.stage === stage,
          );

      const averageDays =
        averagePipelineHealthValue(
          items.map(
            (item) =>
              resolveOpportunityDaysInStage(
                item,
                generatedAt,
              ),
          ),
        );

      const staleCount =
        items.filter(
          (item) =>
            resolveOpportunityInactivityDays(
              item,
              generatedAt,
            )
            >= this.configuration
              .staleActivityDays,
        ).length;

      const criticalCount =
        items.filter(
          (item) =>
            resolveOpportunityDaysInStage(
              item,
              generatedAt,
            )
            >= (
              benchmark
                ?.expectedMaximumDays
              ?? this.configuration
                .criticalStageDays
            ),
        ).length;

      const averageProbability =
        averagePipelineHealthValue(
          items.map(
            (item) =>
              item.winProbability
              ?? item.stageProbability
              ?? 50,
          ),
        );

      const stageAgeLimit =
        benchmark
          ?.expectedMaximumDays
        ?? this.configuration
          .slowStageDays;

      const agePenalty =
        Math.max(
          0,
          (
            averageDays
            - stageAgeLimit
          )
          * 1.5,
        );

      const stalePenalty =
        (
          staleCount
          / items.length
        ) * 35;

      const criticalPenalty =
        (
          criticalCount
          / items.length
        ) * 40;

      const healthScore =
        clampPipelineHealthScore(
          averageProbability
          - agePenalty
          - stalePenalty
          - criticalPenalty
          + 25,
        );

      const bottleneckScore =
        clampPipelineHealthScore(
          100 - healthScore,
        );

      results.push({
        stage,
        stageOrder:
          benchmark?.stageOrder
          ?? items[0]?.stageOrder,

        opportunityCount:
          items.length,

        openPipelineValue:
          roundPipelineHealthNumber(
            items.reduce(
              (total, item) =>
                total
                + Math.max(
                  0,
                  item.amount,
                ),
              0,
            ),
          ),

        weightedPipelineValue:
          roundPipelineHealthNumber(
            items.reduce(
              (total, item) =>
                total
                + resolvePipelineWeightedAmount(
                  item,
                ),
              0,
            ),
          ),

        averageDaysInStage:
          roundPipelineHealthNumber(
            averageDays,
          ),

        averageWinProbability:
          roundPipelineHealthNumber(
            averageProbability,
          ),

        staleOpportunityCount:
          staleCount,

        criticalOpportunityCount:
          criticalCount,

        expectedConversionRate:
          benchmark
            ?.expectedConversionRate,

        bottleneckScore:
          roundPipelineHealthNumber(
            bottleneckScore,
          ),

        healthScore:
          roundPipelineHealthNumber(
            healthScore,
          ),

        grade:
          resolvePipelineHealthGrade(
            healthScore,
            this.configuration,
          ),
      });
    }

    return results.sort(
      (left, right) =>
        (
          left.stageOrder
          ?? Number.MAX_SAFE_INTEGER
        )
        - (
          right.stageOrder
          ?? Number.MAX_SAFE_INTEGER
        ),
    );
  }

  private buildOwnerAnalysis(
    opportunities:
      readonly PipelineHealthOpportunityInput[],
    generatedAt: Date,
  ): readonly PipelineHealthOwnerAnalysis[] {
    const grouped =
      new Map<
        string,
        PipelineHealthOpportunityInput[]
      >();

    for (
      const opportunity
      of opportunities
    ) {
      const ownerId =
        opportunity.ownerId
        ?? "unassigned";

      const existing =
        grouped.get(ownerId)
        ?? [];

      existing.push(
        opportunity,
      );

      grouped.set(
        ownerId,
        existing,
      );
    }

    const results:
      PipelineHealthOwnerAnalysis[] = [];

    for (
      const [ownerId, items]
      of grouped
    ) {
      const averageOpportunityScore =
        averagePipelineHealthValue(
          items.map(
            (item) =>
              item.opportunityScore
              ?? item.healthScore
              ?? 50,
          ),
        );

      const averageRiskScore =
        averagePipelineHealthValue(
          items.map(
            (item) =>
              item.riskScore
              ?? 30,
          ),
        );

      const averageMomentumScore =
        averagePipelineHealthValue(
          items.map(
            (item) =>
              item.momentumScore
              ?? 50,
          ),
        );

      const staleCount =
        items.filter(
          (item) =>
            resolveOpportunityInactivityDays(
              item,
              generatedAt,
            )
            >= this.configuration
              .staleActivityDays,
        ).length;

      const overdueActionCount =
        items.reduce(
          (total, item) =>
            total
            + Math.max(
              0,
              item.overdueActionCount
              ?? 0,
            ),
          0,
        );

      const healthScore =
        clampPipelineHealthScore(
          averageOpportunityScore * 0.4
          + (
            100 - averageRiskScore
          ) * 0.3
          + averageMomentumScore * 0.3
          - staleCount * 4
          - overdueActionCount * 2,
        );

      results.push({
        ownerId,

        opportunityCount:
          items.length,

        openPipelineValue:
          roundPipelineHealthNumber(
            items.reduce(
              (total, item) =>
                total
                + Math.max(
                  0,
                  item.amount,
                ),
              0,
            ),
          ),

        weightedPipelineValue:
          roundPipelineHealthNumber(
            items.reduce(
              (total, item) =>
                total
                + resolvePipelineWeightedAmount(
                  item,
                ),
              0,
            ),
          ),

        averageOpportunityScore:
          roundPipelineHealthNumber(
            averageOpportunityScore,
          ),

        averageRiskScore:
          roundPipelineHealthNumber(
            averageRiskScore,
          ),

        averageMomentumScore:
          roundPipelineHealthNumber(
            averageMomentumScore,
          ),

        staleOpportunityCount:
          staleCount,

        overdueActionCount,

        healthScore:
          roundPipelineHealthNumber(
            healthScore,
          ),

        grade:
          resolvePipelineHealthGrade(
            healthScore,
            this.configuration,
          ),
      });
    }

    return results.sort(
      (left, right) =>
        right.openPipelineValue
        - left.openPipelineValue,
    );
  }

  private buildBottlenecks(
    stages:
      readonly PipelineHealthStageAnalysis[],
    owners:
      readonly PipelineHealthOwnerAnalysis[],
    opportunities:
      readonly PipelineHealthOpportunityInput[],
    generatedAt: Date,
  ): readonly PipelineHealthBottleneck[] {
    const bottlenecks:
      PipelineHealthBottleneck[] = [];

    for (
      const stage
      of stages
    ) {
      if (
        stage.bottleneckScore < 55
      ) {
        continue;
      }

      const affected =
        opportunities.filter(
          (opportunity) =>
            opportunity.stage
            === stage.stage
            && (
              resolveOpportunityDaysInStage(
                opportunity,
                generatedAt,
              )
              >= this.configuration
                .slowStageDays
              || resolveOpportunityInactivityDays(
                opportunity,
                generatedAt,
              )
              >= this.configuration
                .staleActivityDays
            ),
        );

      bottlenecks.push({
        key:
          `stage:${stage.stage}`,

        stage:
          stage.stage,

        level:
          resolvePipelineHealthRiskLevel(
            stage.bottleneckScore,
          ),

        title:
          `Pipeline bottleneck in ${stage.stage}`,

        description:
          `${stage.opportunityCount} opportunities are concentrated in a stage with a bottleneck score of ${stage.bottleneckScore}.`,

        affectedOpportunityCount:
          affected.length,

        affectedPipelineValue:
          roundPipelineHealthNumber(
            affected.reduce(
              (total, opportunity) =>
                total
                + Math.max(
                  0,
                  opportunity.amount,
                ),
              0,
            ),
          ),

        opportunityIds:
          affected.map(
            (opportunity) =>
              opportunity.opportunityId,
          ),

        recommendedAction:
          "Review stage exit criteria, blockers, ownership, and next actions.",
      });
    }

    for (
      const owner
      of owners
    ) {
      if (
        owner.grade !== "critical"
        && owner.grade !== "at-risk"
      ) {
        continue;
      }

      const affected =
        opportunities.filter(
          (opportunity) =>
            (
              opportunity.ownerId
              ?? "unassigned"
            ) === owner.ownerId,
        );

      bottlenecks.push({
        key:
          `owner:${owner.ownerId}`,

        ownerId:
          owner.ownerId,

        level:
          owner.grade === "critical"
            ? "critical"
            : "high",

        title:
          `Owner portfolio requires intervention`,

        description:
          `The opportunity portfolio for ${owner.ownerId} has a health score of ${owner.healthScore}.`,

        affectedOpportunityCount:
          affected.length,

        affectedPipelineValue:
          owner.openPipelineValue,

        opportunityIds:
          affected.map(
            (opportunity) =>
              opportunity.opportunityId,
          ),

        recommendedAction:
          "Initiate manager coaching, opportunity inspection, and action-plan recovery.",
      });
    }

    return bottlenecks
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
      .slice(0, 12);
  }

  private buildRisks(
    context: PipelineHealthContext,
    opportunities:
      readonly PipelineHealthOpportunityInput[],
    dimensions:
      readonly PipelineHealthDimensionScore[],
    coverageRatio: number | undefined,
    weightedPipelineValue: number,
    generatedAt: Date,
  ): readonly PipelineHealthRisk[] {
    const risks:
      PipelineHealthRisk[] = [];

    for (
      const dimension
      of dimensions
    ) {
      if (
        dimension.grade !== "critical"
        && dimension.grade !== "at-risk"
      ) {
        continue;
      }

      risks.push({
        key:
          `dimension:${dimension.dimension}`,

        dimension:
          dimension.dimension,

        level:
          dimension.grade === "critical"
            ? "critical"
            : "high",

        title:
          `${dimension.dimension} health risk`,

        description:
          dimension.summary,

        scoreImpact:
          roundPipelineHealthNumber(
            100 - dimension.score,
          ),

        recommendedAction:
          this.resolveDimensionAction(
            dimension.dimension,
          ),
      });
    }

    const totalPipeline =
      opportunities.reduce(
        (total, opportunity) =>
          total
          + Math.max(
            0,
            opportunity.amount,
          ),
        0,
      );

    if (
      totalPipeline > 0
      && opportunities.length > 0
    ) {
      const largest =
        opportunities.reduce(
          (current, opportunity) =>
            opportunity.amount
            > current.amount
              ? opportunity
              : current,
        );

      const concentrationPercentage =
        (
          largest.amount
          / totalPipeline
        ) * 100;

      if (
        concentrationPercentage
        >= this.configuration
          .concentrationRiskPercentage
      ) {
        risks.push({
          key:
            "opportunity-concentration",

          dimension:
            "concentration",

          level:
            concentrationPercentage
            >= this.configuration
              .criticalConcentrationPercentage
              ? "critical"
              : "high",

          title:
            "Pipeline concentration risk",

          description:
            `A single opportunity represents ${roundPipelineHealthNumber(concentrationPercentage)}% of open pipeline value.`,

          scoreImpact:
            roundPipelineHealthNumber(
              concentrationPercentage,
            ),

          amountAtRisk:
            largest.amount,

          opportunityIds: [
            largest.opportunityId,
          ],

          recommendedAction:
            "Create an executive close plan and strengthen alternative pipeline coverage.",
        });
      }
    }

    const criticalActivity =
      opportunities.filter(
        (opportunity) =>
          resolveOpportunityInactivityDays(
            opportunity,
            generatedAt,
          )
          >= this.configuration
            .criticalActivityDays,
      );

    if (
      criticalActivity.length > 0
    ) {
      risks.push({
        key:
          "critical-inactivity",

        dimension:
          "activity",

        level:
          criticalActivity.length >= 3
            ? "critical"
            : "high",

        title:
          "Critical opportunity inactivity",

        description:
          `${criticalActivity.length} open opportunities exceed the critical inactivity threshold.`,

        scoreImpact:
          Math.min(
            100,
            criticalActivity.length
            * 18,
          ),

        amountAtRisk:
          roundPipelineHealthNumber(
            criticalActivity.reduce(
              (total, opportunity) =>
                total
                + resolvePipelineWeightedAmount(
                  opportunity,
                ),
              0,
            ),
          ),

        opportunityIds:
          criticalActivity.map(
            (opportunity) =>
              opportunity.opportunityId,
          ),

        recommendedAction:
          "Require immediate customer engagement or remove unsupported opportunities from the forecast.",
      });
    }

    if (
      context.revenueTarget
      && context.revenueTarget > 0
      && (
        coverageRatio === undefined
        || coverageRatio
          < this.configuration
            .minimumCoverageRatio
      )
    ) {
      risks.push({
        key:
          "insufficient-coverage",

        dimension:
          "coverage",

        level:
          coverageRatio !== undefined
          && coverageRatio < 0.6
            ? "critical"
            : "high",

        title:
          "Insufficient pipeline coverage",

        description:
          "Open pipeline does not provide sufficient coverage against the configured revenue target.",

        scoreImpact:
          coverageRatio === undefined
            ? 50
            : roundPipelineHealthNumber(
              Math.max(
                0,
                (
                  this.configuration
                    .minimumCoverageRatio
                  - coverageRatio
                ) * 50,
              ),
            ),

        amountAtRisk:
          roundPipelineHealthNumber(
            Math.max(
              0,
              context.revenueTarget
              - weightedPipelineValue,
            ),
          ),

        recommendedAction:
          "Increase qualified pipeline creation and accelerate high-probability opportunities.",
      });
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
      .slice(0, 12);
  }

  private buildRecommendations(
    risks:
      readonly PipelineHealthRisk[],
    bottlenecks:
      readonly PipelineHealthBottleneck[],
  ): readonly PipelineHealthRecommendation[] {
    const recommendations:
      PipelineHealthRecommendation[] = [];

    for (
      const risk
      of risks
    ) {
      recommendations.push({
        key:
          `risk-action:${risk.key}`,

        priority:
          risk.level === "critical"
            ? "critical"
            : risk.level === "high"
              ? "high"
              : risk.level === "medium"
                ? "medium"
                : "low",

        title:
          risk.recommendedAction
          ?? `Address ${risk.title}`,

        description:
          risk.description,

        rationale:
          `This risk is reducing pipeline health in the ${risk.dimension} dimension.`,

        expectedImpact:
          "Improve pipeline reliability, forecast confidence, and management visibility.",

        ownerScope:
          risk.level === "critical"
            ? "executive"
            : "sales-leadership",

        opportunityIds:
          risk.opportunityIds,
      });
    }

    for (
      const bottleneck
      of bottlenecks
    ) {
      recommendations.push({
        key:
          `bottleneck-action:${bottleneck.key}`,

        priority:
          bottleneck.level
          === "critical"
            ? "critical"
            : bottleneck.level
              === "high"
              ? "high"
              : "medium",

        title:
          bottleneck.recommendedAction,

        description:
          bottleneck.description,

        rationale:
          "The bottleneck is delaying opportunity progression and reducing pipeline velocity.",

        expectedImpact:
          "Reduce stage aging, improve conversion flow, and protect revenue timing.",

        ownerScope:
          bottleneck.ownerId
            ? "sales-manager"
            : "sales-leadership",

        opportunityIds:
          bottleneck.opportunityIds,
      });
    }

    const seen =
      new Set<string>();

    return recommendations
      .filter(
        (recommendation) => {
          if (
            seen.has(
              recommendation.key,
            )
          ) {
            return false;
          }

          seen.add(
            recommendation.key,
          );

          return true;
        },
      )
      .slice(0, 12);
  }

  private buildSummary(
    healthScore: number,
    grade:
      PipelineHealthAssessment["grade"],
    dimensions:
      readonly PipelineHealthDimensionScore[],
    risks:
      readonly PipelineHealthRisk[],
    recommendations:
      readonly PipelineHealthRecommendation[],
  ): PipelineHealthSummary {
    const sortedDimensions =
      [...dimensions].sort(
        (left, right) =>
          right.score - left.score,
      );

    const strongest =
      sortedDimensions[0];

    const weakest =
      sortedDimensions[
        sortedDimensions.length - 1
      ];

    let executiveStatus:
      PipelineHealthSummary["executiveStatus"];

    if (
      grade === "excellent"
      || grade === "healthy"
    ) {
      executiveStatus = "strong";
    } else if (
      grade === "watch"
    ) {
      executiveStatus = "stable";
    } else if (
      grade === "at-risk"
    ) {
      executiveStatus =
        "attention-required";
    } else {
      executiveStatus =
        "intervention-required";
    }

    const headline =
      grade === "excellent"
        ? "Pipeline health is excellent."
        : grade === "healthy"
          ? "Pipeline health is stable and healthy."
          : grade === "watch"
            ? "Pipeline health requires active monitoring."
            : grade === "at-risk"
              ? "Pipeline health requires corrective action."
              : "Pipeline health requires immediate executive intervention.";

    const narrativeParts = [
      `Overall pipeline health score is ${healthScore}.`,
    ];

    if (strongest) {
      narrativeParts.push(
        `Strongest dimension: ${strongest.dimension} at ${strongest.score}.`,
      );
    }

    if (weakest) {
      narrativeParts.push(
        `Weakest dimension: ${weakest.dimension} at ${weakest.score}.`,
      );
    }

    if (risks[0]) {
      narrativeParts.push(
        `Primary risk: ${risks[0].title}.`,
      );
    }

    if (recommendations[0]) {
      narrativeParts.push(
        `Priority action: ${recommendations[0].title}.`,
      );
    }

    return {
      headline,
      narrative:
        narrativeParts.join(" "),

      executiveStatus,

      primaryStrength:
        strongest
          ? strongest.dimension
          : undefined,

      primaryRisk:
        risks[0]?.title,

      primaryAction:
        recommendations[0]?.title,
    };
  }

  private resolveDimensionAction(
    dimension:
      PipelineHealthDimension,
  ): string {
    const actions:
      Record<
        PipelineHealthDimension,
        string
      > = {
        coverage:
          "Increase qualified pipeline creation and strengthen target coverage.",

        quality:
          "Requalify weak opportunities and focus resources on high-value, high-probability deals.",

        velocity:
          "Remove stage blockers and enforce time-bound opportunity progression.",

        conversion:
          "Review loss reasons, qualification standards, and stage exit discipline.",

        concentration:
          "Diversify pipeline and reduce dependence on a small number of large opportunities.",

        activity:
          "Restore customer engagement and close overdue next actions.",

        "stage-balance":
          "Rebalance pipeline creation and progression across sales stages.",

        "forecast-alignment":
          "Reconcile weighted pipeline assumptions with the active revenue forecast.",
      };

    return actions[dimension];
  }

  private validateContext(
    context: PipelineHealthContext,
  ): void {
    if (!context.tenantId.trim()) {
      throw new Error(
        "Pipeline health requires a tenantId.",
      );
    }

    const periodStart =
      new Date(
        context.periodStart,
      );

    const periodEnd =
      new Date(
        context.periodEnd,
      );

    if (
      Number.isNaN(
        periodStart.getTime(),
      )
    ) {
      throw new Error(
        "Pipeline health periodStart is invalid.",
      );
    }

    if (
      Number.isNaN(
        periodEnd.getTime(),
      )
    ) {
      throw new Error(
        "Pipeline health periodEnd is invalid.",
      );
    }

    if (
      periodEnd <= periodStart
    ) {
      throw new Error(
        "Pipeline health periodEnd must be after periodStart.",
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
        "Pipeline health revenueTarget must be a non-negative finite number.",
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
        !opportunity.opportunityId.trim()
      ) {
        throw new Error(
          "Pipeline health received an opportunity without an opportunityId.",
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

export const createPipelineHealthEngine = (
  dependencies:
    PipelineHealthEngineDependencies = {},
): PipelineHealthEngine =>
  new PipelineHealthEngine(
    dependencies,
  );
