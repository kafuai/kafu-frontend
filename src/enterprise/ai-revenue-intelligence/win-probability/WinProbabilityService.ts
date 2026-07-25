import type {
  WinProbabilityBatchRequest,
  WinProbabilityBatchResult,
  WinProbabilityContext,
  WinProbabilityHistoryEntry,
  WinProbabilityPrediction,
  WinProbabilityRequest,
} from "./WinProbabilityTypes";
import {
  WinProbabilityRuntime,
} from "./WinProbabilityRuntime";
import type {
  WinProbabilityRepository,
} from "./WinProbabilityRepository";

export interface WinProbabilityContextProvider {
  getContext(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<WinProbabilityContext>;
}

export interface WinProbabilityServiceDependencies {
  runtime: WinProbabilityRuntime;
  repository: WinProbabilityRepository;
  contextProvider: WinProbabilityContextProvider;
}

export class WinProbabilityService {
  private readonly runtime: WinProbabilityRuntime;
  private readonly repository: WinProbabilityRepository;
  private readonly contextProvider:
    WinProbabilityContextProvider;

  constructor(
    dependencies: WinProbabilityServiceDependencies,
  ) {
    this.runtime = dependencies.runtime;
    this.repository = dependencies.repository;
    this.contextProvider = dependencies.contextProvider;
  }

  async getLatestPrediction(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<WinProbabilityPrediction | null> {
    return this.runtime.getLatest(
      input.tenantId,
      input.opportunityId,
      input.workspaceId,
    );
  }

  async calculate(
    request: WinProbabilityRequest,
  ): Promise<WinProbabilityPrediction> {
    return this.runtime.calculate(request);
  }

  async calculateFromOpportunity(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<WinProbabilityPrediction> {
    const context = await this.contextProvider.getContext({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      opportunityId: input.opportunityId,
    });

    return this.runtime.calculate({
      context,
      requestedBy: input.requestedBy,
      correlationId: input.correlationId,
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
  }): Promise<WinProbabilityPrediction> {
    const context = await this.contextProvider.getContext({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      opportunityId: input.opportunityId,
    });

    return this.runtime.recalculate({
      context,
      forceRefresh: true,
      requestedBy: input.requestedBy,
      correlationId: input.correlationId,
      reason:
        input.reason ?? "manual-recalculation",
    });
  }

  async refreshBatch(
    request: WinProbabilityBatchRequest,
  ): Promise<WinProbabilityBatchResult> {
    const predictions: WinProbabilityPrediction[] = [];
    const failures: {
      opportunityId: string;
      code: string;
      message: string;
    }[] = [];

    for (const opportunityId of request.opportunityIds) {
      try {
        const prediction = await this.recalculate({
          tenantId: request.tenantId,
          workspaceId: request.workspaceId,
          opportunityId,
          requestedBy: request.requestedBy,
          correlationId: request.correlationId,
          reason: "batch-refresh",
        });

        predictions.push(prediction);
      } catch (error) {
        failures.push({
          opportunityId,
          code: "WIN_PROBABILITY_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Unknown win-probability failure.",
        });
      }
    }

    return {
      requested: request.opportunityIds.length,
      succeeded: predictions.length,
      failed: failures.length,
      predictions,
      failures,
    };
  }

  async getHistory(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    limit?: number;
    before?: string;
  }): Promise<readonly WinProbabilityHistoryEntry[]> {
    return this.repository.findHistory({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      opportunityId: input.opportunityId,
      limit: input.limit,
      before: input.before,
    });
  }
}
