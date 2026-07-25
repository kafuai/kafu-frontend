import type {
  DealRiskAssessment,
} from "../deal-risk-detection";
import type {
  NextBestActionPlan,
} from "../next-best-action";
import type {
  OpportunityScore,
} from "../opportunity-scoring";
import type {
  RevenuePredictionForecast,
} from "../revenue-prediction";
import type {
  SalesForecast,
} from "../sales-forecast";
import type {
  WinProbabilityPrediction,
} from "../win-probability";
import {
  assertOpportunitySource,
  type RevenueIntelligenceOpportunitySource,
} from "./RevenueIntelligenceContext";
import type {
  RevenueIntelligenceComponent,
  RevenueIntelligenceComponentExecution,
  RevenueIntelligenceConfiguration,
  RevenueIntelligenceExecutionOptions,
  RevenueIntelligenceHealth,
  RevenueIntelligenceOpportunitySnapshot,
  RevenueIntelligencePipelineSummary,
} from "./RevenueIntelligenceTypes";

export interface RevenueIntelligenceOpportunityScoringExecutor {
  calculate(
    context:
      RevenueIntelligenceOpportunitySource["opportunityScoringContext"],
  ): Promise<OpportunityScore>;
}

export interface RevenueIntelligenceWinProbabilityExecutor {
  calculate(
    context: ReturnType<
      RevenueIntelligenceOpportunitySource["winProbabilityContext"]
    >,
  ): Promise<WinProbabilityPrediction>;
}

export interface RevenueIntelligenceRevenuePredictionExecutor {
  calculate(
    context: ReturnType<
      RevenueIntelligenceOpportunitySource["revenuePredictionContext"]
    >,
  ): Promise<RevenuePredictionForecast>;
}

export interface RevenueIntelligenceDealRiskExecutor {
  calculate(
    context: ReturnType<
      RevenueIntelligenceOpportunitySource["dealRiskContext"]
    >,
  ): Promise<DealRiskAssessment>;
}

export interface RevenueIntelligenceNextBestActionExecutor {
  generate(input: {
    context: ReturnType<
      RevenueIntelligenceOpportunitySource["nextBestActionContext"]
    >;

    maximumRecommendations?: number;
    forceRefresh?: boolean;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<NextBestActionPlan>;
}

export interface RevenueIntelligenceSalesForecastExecutor {
  calculate(context: unknown): Promise<SalesForecast>;
}

export interface RevenueIntelligenceOrchestratorDependencies {
  opportunityScoring:
    RevenueIntelligenceOpportunityScoringExecutor;

  winProbability:
    RevenueIntelligenceWinProbabilityExecutor;

  revenuePrediction:
    RevenueIntelligenceRevenuePredictionExecutor;

  dealRisk:
    RevenueIntelligenceDealRiskExecutor;

  nextBestAction?:
    RevenueIntelligenceNextBestActionExecutor;

  salesForecast?:
    RevenueIntelligenceSalesForecastExecutor;

  configuration:
    RevenueIntelligenceConfiguration;
}

interface TimedExecutionResult<T> {
  value?: T;
  execution:
    RevenueIntelligenceComponentExecution;
  error?: unknown;
}

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

const calculateRevenueAtRisk = (
  revenuePrediction: RevenuePredictionForecast,
  dealRisk: DealRiskAssessment,
): number => {
  const riskFactor =
    clamp(dealRisk.riskScore) / 100;

  return round(
    revenuePrediction.expectedRevenue
    * riskFactor,
  );
};

const calculateSnapshotConfidence = (
  opportunityScore: OpportunityScore,
  winProbability: WinProbabilityPrediction,
  revenuePrediction: RevenuePredictionForecast,
  dealRisk: DealRiskAssessment,
): number =>
  round(
    clamp(
      (
        opportunityScore.confidence
        + winProbability.confidence
        + revenuePrediction.confidenceScore
        + dealRisk.confidence
      ) / 4,
    ),
  );

export class RevenueIntelligenceOrchestrator {
  private readonly opportunityScoring:
    RevenueIntelligenceOpportunityScoringExecutor;

  private readonly winProbability:
    RevenueIntelligenceWinProbabilityExecutor;

  private readonly revenuePrediction:
    RevenueIntelligenceRevenuePredictionExecutor;

  private readonly dealRisk:
    RevenueIntelligenceDealRiskExecutor;

  private readonly nextBestAction?:
    RevenueIntelligenceNextBestActionExecutor;

  private readonly salesForecast?:
    RevenueIntelligenceSalesForecastExecutor;

  private readonly configuration:
    RevenueIntelligenceConfiguration;

  constructor(
    dependencies:
      RevenueIntelligenceOrchestratorDependencies,
  ) {
    this.opportunityScoring =
      dependencies.opportunityScoring;

    this.winProbability =
      dependencies.winProbability;

    this.revenuePrediction =
      dependencies.revenuePrediction;

    this.dealRisk =
      dependencies.dealRisk;

    this.nextBestAction =
      dependencies.nextBestAction;

    this.salesForecast =
      dependencies.salesForecast;

    this.configuration =
      dependencies.configuration;
  }

  async executeOpportunity(
    source: RevenueIntelligenceOpportunitySource,
    options: RevenueIntelligenceExecutionOptions = {},
  ): Promise<{
    snapshot:
      RevenueIntelligenceOpportunitySnapshot;
    executions:
      readonly RevenueIntelligenceComponentExecution[];
  }> {
    assertOpportunitySource(source);

    const executions:
      RevenueIntelligenceComponentExecution[] = [];

    const opportunityScoreResult =
      await this.executeComponent(
        "opportunity-scoring",
        () =>
          this.opportunityScoring.calculate(
            source.opportunityScoringContext,
          ),
      );

    executions.push(
      opportunityScoreResult.execution,
    );

    const opportunityScore =
      this.requireValue(
        opportunityScoreResult,
        "Opportunity scoring failed.",
      );

    const winProbabilityResult =
      await this.executeComponent(
        "win-probability",
        () =>
          this.winProbability.calculate(
            source.winProbabilityContext({
              opportunityScore,
            }),
          ),
      );

    executions.push(
      winProbabilityResult.execution,
    );

    const winProbability =
      this.requireValue(
        winProbabilityResult,
        "Win probability prediction failed.",
      );

    const revenuePredictionResult =
      await this.executeComponent(
        "revenue-prediction",
        () =>
          this.revenuePrediction.calculate(
            source.revenuePredictionContext({
              opportunityScore,
              winProbability,
            }),
          ),
      );

    executions.push(
      revenuePredictionResult.execution,
    );

    const revenuePrediction =
      this.requireValue(
        revenuePredictionResult,
        "Revenue prediction failed.",
      );

    const dealRiskResult =
      await this.executeComponent(
        "deal-risk-detection",
        () =>
          this.dealRisk.calculate(
            source.dealRiskContext({
              opportunityScore,
              winProbability,
              revenuePrediction,
            }),
          ),
      );

    executions.push(
      dealRiskResult.execution,
    );

    const dealRisk =
      this.requireValue(
        dealRiskResult,
        "Deal risk detection failed.",
      );

    let nextBestAction:
      NextBestActionPlan | undefined;

    if (
      options.includeNextBestAction
      !== false
      && this.nextBestAction
    ) {
      const nextBestActionResult =
        await this.executeComponent(
          "next-best-action",
          () =>
            this.nextBestAction!.generate({
              context:
                source.nextBestActionContext({
                  opportunityScore,
                  winProbability,
                  revenuePrediction,
                  dealRisk,
                }),

              maximumRecommendations:
                options.maximumRecommendations,

              forceRefresh:
                options.forceRefresh,

              requestedBy:
                options.requestedBy,

              correlationId:
                options.correlationId,

              reason:
                options.reason,
            }),
        );

      executions.push(
        nextBestActionResult.execution,
      );

      if (nextBestActionResult.value) {
        nextBestAction =
          nextBestActionResult.value;
      } else if (
        !this.configuration
          .continueOnComponentFailure
      ) {
        throw new Error(
          "Next best action generation failed.",
        );
      }
    } else {
      executions.push(
        this.createSkippedExecution(
          "next-best-action",
        ),
      );
    }

    const confidence =
      calculateSnapshotConfidence(
        opportunityScore,
        winProbability,
        revenuePrediction,
        dealRisk,
      );

    const expectedRevenue =
      round(
        revenuePrediction.expectedRevenue,
      );

    const revenueAtRisk =
      calculateRevenueAtRisk(
        revenuePrediction,
        dealRisk,
      );

    return {
      snapshot: {
        tenantId:
          source.reference.tenantId,

        workspaceId:
          source.reference.workspaceId,

        opportunityId:
          source.reference.opportunityId,

        accountId:
          source.reference.accountId,

        ownerId:
          source.reference.ownerId,

        currency:
          source.reference.currency,

        dealValue:
          round(source.reference.dealValue),

        opportunityScore,
        winProbability,
        revenuePrediction,
        dealRisk,

        nextBestAction,

        health:
          this.resolveHealth(
            dealRisk.riskScore,
            dealRisk.immediateAttentionRequired,
          ),

        confidence,

        expectedRevenue,
        revenueAtRisk,

        immediateAttentionRequired:
          dealRisk.immediateAttentionRequired,

        generatedAt:
          new Date().toISOString(),

        metadata:
          source.reference.metadata,
      },

      executions,
    };
  }

  buildPipelineSummary(
    snapshots:
      readonly RevenueIntelligenceOpportunitySnapshot[],
    input: {
      tenantId: string;
      workspaceId?: string;
      currency: string;
      requestedOpportunityCount: number;
      failedOpportunityCount: number;
    },
  ): RevenueIntelligencePipelineSummary {
    const pipelineValue =
      snapshots.reduce(
        (total, snapshot) =>
          total + snapshot.dealValue,
        0,
      );

    const expectedRevenue =
      snapshots.reduce(
        (total, snapshot) =>
          total
          + snapshot.expectedRevenue,
        0,
      );

    const revenueAtRisk =
      snapshots.reduce(
        (total, snapshot) =>
          total
          + snapshot.revenueAtRisk,
        0,
      );

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

    return {
      tenantId:
        input.tenantId,

      workspaceId:
        input.workspaceId,

      currency:
        input.currency,

      opportunityCount:
        input.requestedOpportunityCount,

      processedOpportunityCount:
        snapshots.length,

      failedOpportunityCount:
        input.failedOpportunityCount,

      pipelineValue:
        round(pipelineValue),

      expectedRevenue:
        round(expectedRevenue),

      revenueAtRisk:
        round(revenueAtRisk),

      averageOpportunityScore:
        round(
          average(
            snapshots.map(
              (snapshot) =>
                snapshot
                  .opportunityScore
                  .score,
            ),
          ),
        ),

      averageWinProbability:
        round(
          average(
            snapshots.map(
              (snapshot) =>
                snapshot
                  .winProbability
                  .probability,
            ),
          ),
        ),

      averageConfidence:
        round(
          average(
            snapshots.map(
              (snapshot) =>
                snapshot.confidence,
            ),
          ),
        ),

      averageRiskScore:
        round(
          average(
            snapshots.map(
              (snapshot) =>
                snapshot
                  .dealRisk
                  .riskScore,
            ),
          ),
        ),

      healthyCount:
        snapshots.filter(
          (snapshot) =>
            snapshot.health === "healthy",
        ).length,

      watchCount:
        snapshots.filter(
          (snapshot) =>
            snapshot.health === "watch",
        ).length,

      atRiskCount:
        snapshots.filter(
          (snapshot) =>
            snapshot.health === "at-risk",
        ).length,

      criticalCount:
        snapshots.filter(
          (snapshot) =>
            snapshot.health === "critical",
        ).length,

      immediateAttentionCount:
        snapshots.filter(
          (snapshot) =>
            snapshot
              .immediateAttentionRequired,
        ).length,

      topOpportunityIds:
        [...snapshots]
          .sort(
            (left, right) =>
              right.expectedRevenue
              - left.expectedRevenue,
          )
          .slice(0, 10)
          .map(
            (snapshot) =>
              snapshot.opportunityId,
          ),

      topRiskOpportunityIds:
        [...snapshots]
          .sort(
            (left, right) =>
              right.revenueAtRisk
              - left.revenueAtRisk,
          )
          .slice(0, 10)
          .map(
            (snapshot) =>
              snapshot.opportunityId,
          ),

      generatedAt:
        new Date().toISOString(),
    };
  }

  async executeSalesForecast(
    context: unknown,
  ): Promise<{
    forecast: SalesForecast;
    execution:
      RevenueIntelligenceComponentExecution;
  }> {
    if (!this.salesForecast) {
      throw new Error(
        "Sales forecast executor is not configured.",
      );
    }

    const result =
      await this.executeComponent(
        "sales-forecast",
        () =>
          this.salesForecast!.calculate(
            context,
          ),
      );

    return {
      forecast:
        this.requireValue(
          result,
          "Sales forecast calculation failed.",
        ),

      execution:
        result.execution,
    };
  }

  private resolveHealth(
    riskScore: number,
    immediateAttentionRequired: boolean,
  ): RevenueIntelligenceHealth {
    if (
      immediateAttentionRequired
      || riskScore
        >= this.configuration
          .atRiskRiskThreshold
    ) {
      return "critical";
    }

    if (
      riskScore
      >= this.configuration
        .watchRiskThreshold
    ) {
      return "at-risk";
    }

    if (
      riskScore
      >= this.configuration
        .healthyRiskThreshold
    ) {
      return "watch";
    }

    return "healthy";
  }

  private async executeComponent<T>(
    component: RevenueIntelligenceComponent,
    executor: () => Promise<T>,
  ): Promise<TimedExecutionResult<T>> {
    const startedAt =
      new Date();

    try {
      const value =
        await executor();

      const completedAt =
        new Date();

      return {
        value,

        execution: {
          component,
          status: "completed",

          startedAt:
            startedAt.toISOString(),

          completedAt:
            completedAt.toISOString(),

          durationMs:
            Math.max(
              0,
              completedAt.getTime()
              - startedAt.getTime(),
            ),
        },
      };
    } catch (error) {
      const completedAt =
        new Date();

      return {
        error,

        execution: {
          component,
          status: "failed",

          startedAt:
            startedAt.toISOString(),

          completedAt:
            completedAt.toISOString(),

          durationMs:
            Math.max(
              0,
              completedAt.getTime()
              - startedAt.getTime(),
            ),

          errorCode:
            error
            && typeof error === "object"
            && "code" in error
              ? String(error.code)
              : undefined,

          errorMessage:
            error instanceof Error
              ? error.message
              : "Unknown component failure.",
        },
      };
    }
  }

  private requireValue<T>(
    result: TimedExecutionResult<T>,
    message: string,
  ): T {
    if (result.value !== undefined) {
      return result.value;
    }

    if (result.error instanceof Error) {
      throw result.error;
    }

    throw new Error(message);
  }

  private createSkippedExecution(
    component: RevenueIntelligenceComponent,
  ): RevenueIntelligenceComponentExecution {
    const timestamp =
      new Date().toISOString();

    return {
      component,
      status: "skipped",

      startedAt: timestamp,
      completedAt: timestamp,

      durationMs: 0,
    };
  }
}


