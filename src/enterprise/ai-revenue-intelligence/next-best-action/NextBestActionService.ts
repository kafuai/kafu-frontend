import type {
  NextBestActionContext,
  NextBestActionHistoryQuery,
  NextBestActionPlan,
  NextBestActionRecommendation,
  NextBestActionRequest,
  NextBestActionStatusUpdate,
} from "./NextBestActionTypes";
import {
  NextBestActionRuntime,
} from "./NextBestActionRuntime";
import type {
  NextBestActionRepository,
} from "./NextBestActionRepository";

export interface NextBestActionContextProvider {
  getContext(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<NextBestActionContext>;
}

export interface NextBestActionServiceDependencies {
  runtime: NextBestActionRuntime;
  repository: NextBestActionRepository;
  contextProvider:
    NextBestActionContextProvider;
}

export class NextBestActionService {
  private readonly runtime:
    NextBestActionRuntime;

  private readonly repository:
    NextBestActionRepository;

  private readonly contextProvider:
    NextBestActionContextProvider;

  constructor(
    dependencies:
      NextBestActionServiceDependencies,
  ) {
    this.runtime =
      dependencies.runtime;

    this.repository =
      dependencies.repository;

    this.contextProvider =
      dependencies.contextProvider;
  }

  async getLatestPlan(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<NextBestActionPlan | null> {
    return this.runtime.getLatest(
      input.tenantId,
      input.opportunityId,
      input.workspaceId,
    );
  }

  async generate(
    request: NextBestActionRequest,
  ): Promise<NextBestActionPlan> {
    return this.runtime.generate(
      request,
    );
  }

  async generateFromOpportunity(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    maximumRecommendations?: number;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<NextBestActionPlan> {
    const context =
      await this.contextProvider.getContext({
        tenantId:
          input.tenantId,

        workspaceId:
          input.workspaceId,

        opportunityId:
          input.opportunityId,
      });

    return this.runtime.generate({
      context,

      maximumRecommendations:
        input.maximumRecommendations,

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
    maximumRecommendations?: number;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<NextBestActionPlan> {
    const context =
      await this.contextProvider.getContext({
        tenantId:
          input.tenantId,

        workspaceId:
          input.workspaceId,

        opportunityId:
          input.opportunityId,
      });

    return this.runtime.regenerate({
      context,

      forceRefresh: true,

      maximumRecommendations:
        input.maximumRecommendations,

      requestedBy:
        input.requestedBy,

      correlationId:
        input.correlationId,

      reason:
        input.reason
        ?? "manual-regeneration",
    });
  }

  async updateStatus(
    update: NextBestActionStatusUpdate,
  ): Promise<NextBestActionRecommendation> {
    return this.runtime.updateStatus(
      update,
    );
  }

  async getRecommendationHistory(
    query: NextBestActionHistoryQuery,
  ): Promise<
    readonly NextBestActionRecommendation[]
  > {
    return this.repository
      .findRecommendations(query);
  }
}
