import type {
  RevenuePrediction,
  RevenuePredictionBatchRequest,
  RevenuePredictionBatchResult,
  RevenuePredictionContext,
  RevenuePredictionHistoryEntry,
  RevenuePredictionRequest,
} from "./RevenuePredictionTypes";
import {
  RevenuePredictionRuntime,
} from "./RevenuePredictionRuntime";
import type {
  RevenuePredictionRepository,
} from "./RevenuePredictionRepository";

export interface RevenuePredictionContextProvider {
  getContext(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<RevenuePredictionContext>;
}

export interface RevenuePredictionServiceDependencies {
  runtime: RevenuePredictionRuntime;
  repository: RevenuePredictionRepository;
  contextProvider:
    RevenuePredictionContextProvider;
}

export class RevenuePredictionService {
  private readonly runtime:
    RevenuePredictionRuntime;

  private readonly repository:
    RevenuePredictionRepository;

  private readonly contextProvider:
    RevenuePredictionContextProvider;

  constructor(
    dependencies:
      RevenuePredictionServiceDependencies,
  ) {
    this.runtime = dependencies.runtime;
    this.repository =
      dependencies.repository;
    this.contextProvider =
      dependencies.contextProvider;
  }

  async getLatestPrediction(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<RevenuePrediction | null> {
    return this.runtime.getLatest(
      input.tenantId,
      input.opportunityId,
      input.workspaceId,
    );
  }

  async calculate(
    request: RevenuePredictionRequest,
  ): Promise<RevenuePrediction> {
    return this.runtime.calculate(request);
  }

  async calculateFromOpportunity(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
    horizon?: RevenuePredictionRequest["horizon"];
  }): Promise<RevenuePrediction> {
    const context =
      await this.contextProvider.getContext({
        tenantId: input.tenantId,
        workspaceId: input.workspaceId,
        opportunityId:
          input.opportunityId,
      });

    return this.runtime.calculate({
      context,
      horizon: input.horizon,
      requestedBy:
        input.requestedBy,
      correlationId:
        input.correlationId,
      reason: input.reason,
    });
  }

  async recalculate(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
    horizon?: RevenuePredictionRequest["horizon"];
  }): Promise<RevenuePrediction> {
    const context =
      await this.contextProvider.getContext({
        tenantId: input.tenantId,
        workspaceId: input.workspaceId,
        opportunityId:
          input.opportunityId,
      });

    return this.runtime.recalculate({
      context,
      horizon: input.horizon,
      forceRefresh: true,
      requestedBy:
        input.requestedBy,
      correlationId:
        input.correlationId,
      reason:
        input.reason
        ?? "manual-recalculation",
    });
  }

  async refreshBatch(
    request: RevenuePredictionBatchRequest,
  ): Promise<RevenuePredictionBatchResult> {
    const predictions:
      RevenuePrediction[] = [];

    const failures: {
      opportunityId: string;
      code: string;
      message: string;
    }[] = [];

    for (
      const opportunityId
      of request.opportunityIds
    ) {
      try {
        const prediction =
          await this.recalculate({
            tenantId: request.tenantId,
            workspaceId:
              request.workspaceId,
            opportunityId,
            requestedBy:
              request.requestedBy,
            correlationId:
              request.correlationId,
            horizon: request.horizon,
            reason: "batch-refresh",
          });

        predictions.push(prediction);
      } catch (error) {
        failures.push({
          opportunityId,
          code:
            "REVENUE_PREDICTION_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Unknown revenue-prediction failure.",
        });
      }
    }

    const currencyTotals =
      predictions.reduce<
        Record<string, number>
      >((totals, prediction) => {
        totals[prediction.currency] =
          (
            totals[prediction.currency]
            ?? 0
          )
          + prediction.predictedRevenue;

        return totals;
      }, {});

    return {
      requested:
        request.opportunityIds.length,
      succeeded: predictions.length,
      failed: failures.length,
      predictions,
      failures,
      currencyTotals,
    };
  }

  async getHistory(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    limit?: number;
    before?: string;
  }): Promise<
    readonly RevenuePredictionHistoryEntry[]
  > {
    return this.repository.findHistory({
      tenantId: input.tenantId,
      workspaceId:
        input.workspaceId,
      opportunityId:
        input.opportunityId,
      limit: input.limit,
      before: input.before,
    });
  }
}
