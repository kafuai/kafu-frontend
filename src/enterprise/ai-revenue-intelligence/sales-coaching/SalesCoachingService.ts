import type {
  SalesCoachingBatchRequest,
  SalesCoachingBatchResult,
  SalesCoachingContext,
  SalesCoachingHistoryEntry,
  SalesCoachingPlan,
  SalesCoachingRecommendation,
  SalesCoachingRecommendationStatus,
  SalesCoachingRequest,
} from "./SalesCoachingTypes";
import {
  SalesCoachingRuntime,
} from "./SalesCoachingRuntime";
import type {
  SalesCoachingRepository,
} from "./SalesCoachingRepository";

export interface SalesCoachingContextProvider {
  getContext(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<SalesCoachingContext>;
}

export interface SalesCoachingServiceDependencies {
  runtime: SalesCoachingRuntime;
  repository: SalesCoachingRepository;
  contextProvider:
    SalesCoachingContextProvider;
}

export class SalesCoachingService {
  private readonly runtime:
    SalesCoachingRuntime;

  private readonly repository:
    SalesCoachingRepository;

  private readonly contextProvider:
    SalesCoachingContextProvider;

  constructor(
    dependencies:
      SalesCoachingServiceDependencies,
  ) {
    this.runtime = dependencies.runtime;
    this.repository =
      dependencies.repository;
    this.contextProvider =
      dependencies.contextProvider;
  }

  async getLatestPlan(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<SalesCoachingPlan | null> {
    return this.runtime.getLatest(
      input.tenantId,
      input.opportunityId,
      input.workspaceId,
    );
  }

  async generate(
    request: SalesCoachingRequest,
  ): Promise<SalesCoachingPlan> {
    return this.runtime.generate(request);
  }

  async generateFromOpportunity(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<SalesCoachingPlan> {
    const context =
      await this.contextProvider
        .getContext({
          tenantId: input.tenantId,
          workspaceId:
            input.workspaceId,
          opportunityId:
            input.opportunityId,
        });

    return this.runtime.generate({
      context,
      requestedBy:
        input.requestedBy,
      correlationId:
        input.correlationId,
      reason:
        input.reason,
    });
  }

  async regenerate(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<SalesCoachingPlan> {
    const context =
      await this.contextProvider
        .getContext({
          tenantId: input.tenantId,
          workspaceId:
            input.workspaceId,
          opportunityId:
            input.opportunityId,
        });

    return this.runtime.regenerate({
      context,
      forceRefresh: true,
      requestedBy:
        input.requestedBy,
      correlationId:
        input.correlationId,
      reason:
        input.reason
        ?? "manual-regeneration",
    });
  }

  async refreshBatch(
    request: SalesCoachingBatchRequest,
  ): Promise<SalesCoachingBatchResult> {
    const plans: SalesCoachingPlan[] = [];

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
        const plan =
          await this.regenerate({
            tenantId: request.tenantId,
            workspaceId:
              request.workspaceId,
            opportunityId,
            requestedBy:
              request.requestedBy,
            correlationId:
              request.correlationId,
            reason:
              "batch-refresh",
          });

        plans.push(plan);
      } catch (error) {
        failures.push({
          opportunityId,
          code:
            "SALES_COACHING_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Unknown sales-coaching failure.",
        });
      }
    }

    return {
      requested:
        request.opportunityIds.length,
      succeeded: plans.length,
      failed: failures.length,
      plans,
      failures,
    };
  }

  async updateRecommendationStatus(
    input: {
      tenantId: string;
      workspaceId?: string;
      opportunityId: string;
      recommendationId: string;
      status:
        SalesCoachingRecommendationStatus;
      actorId?: string;
      reason?: string;
      correlationId?: string;
    },
  ): Promise<SalesCoachingRecommendation> {
    return this.runtime
      .updateRecommendationStatus(
        input,
      );
  }

  async acceptRecommendation(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    recommendationId: string;
    actorId?: string;
    correlationId?: string;
  }): Promise<SalesCoachingRecommendation> {
    return this.updateRecommendationStatus({
      ...input,
      status: "accepted",
    });
  }

  async startRecommendation(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    recommendationId: string;
    actorId?: string;
    correlationId?: string;
  }): Promise<SalesCoachingRecommendation> {
    return this.updateRecommendationStatus({
      ...input,
      status: "in-progress",
    });
  }

  async completeRecommendation(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    recommendationId: string;
    actorId?: string;
    correlationId?: string;
  }): Promise<SalesCoachingRecommendation> {
    return this.updateRecommendationStatus({
      ...input,
      status: "completed",
    });
  }

  async dismissRecommendation(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    recommendationId: string;
    actorId?: string;
    correlationId?: string;
    reason: string;
  }): Promise<SalesCoachingRecommendation> {
    return this.updateRecommendationStatus({
      ...input,
      status: "dismissed",
    });
  }

  async getHistory(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    limit?: number;
    before?: string;
  }): Promise<
    readonly SalesCoachingHistoryEntry[]
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

  async getRecommendation(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    recommendationId: string;
  }): Promise<
    SalesCoachingRecommendation | null
  > {
    return this.repository
      .findRecommendation(input);
  }
}

export const createSalesCoachingService = (
  dependencies:
    SalesCoachingServiceDependencies,
): SalesCoachingService =>
  new SalesCoachingService(dependencies);
