import {
  OpportunityScore,
  OpportunityScoreHistoryEntry,
  OpportunityScoringContext,
  OpportunityScoringRefreshRequest,
  OpportunityScoringRefreshResult,
  OpportunityScoringRequest,
} from "./OpportunityScoringTypes";
import {
  OpportunityScoringRuntime,
} from "./OpportunityScoringRuntime";
import {
  OpportunityScoringRepository,
} from "./OpportunityScoringRepository";

export interface OpportunityScoringContextProvider {
  getContext(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<OpportunityScoringContext>;
}

export interface OpportunityScoringServiceDependencies {
  runtime: OpportunityScoringRuntime;
  repository: OpportunityScoringRepository;
  contextProvider: OpportunityScoringContextProvider;
}

export class OpportunityScoringService {
  private readonly runtime: OpportunityScoringRuntime;
  private readonly repository: OpportunityScoringRepository;
  private readonly contextProvider:
    OpportunityScoringContextProvider;

  constructor(
    dependencies: OpportunityScoringServiceDependencies,
  ) {
    this.runtime = dependencies.runtime;
    this.repository = dependencies.repository;
    this.contextProvider = dependencies.contextProvider;
  }

  async getLatestScore(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<OpportunityScore | null> {
    return this.runtime.getLatest(
      input.tenantId,
      input.opportunityId,
      input.workspaceId,
    );
  }

  async calculateScore(
    request: OpportunityScoringRequest,
  ): Promise<OpportunityScore> {
    return this.runtime.calculate(request);
  }

  async calculateFromOpportunity(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<OpportunityScore> {
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

  async recalculateScore(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<OpportunityScore> {
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
      reason: input.reason ?? "manual-recalculation",
    });
  }

  async refreshScores(
    request: OpportunityScoringRefreshRequest,
  ): Promise<OpportunityScoringRefreshResult> {
    const scores: OpportunityScore[] = [];
    const failures: {
      opportunityId: string;
      code: string;
      message: string;
    }[] = [];

    for (const opportunityId of request.opportunityIds) {
      try {
        const score = await this.recalculateScore({
          tenantId: request.tenantId,
          workspaceId: request.workspaceId,
          opportunityId,
          requestedBy: request.requestedBy,
          correlationId: request.correlationId,
          reason: "batch-refresh",
        });

        scores.push(score);
      } catch (error) {
        failures.push({
          opportunityId,
          code: "SCORING_FAILED",
          message:
            error instanceof Error
              ? error.message
              : "Unknown scoring failure.",
        });
      }
    }

    return {
      requested: request.opportunityIds.length,
      succeeded: scores.length,
      failed: failures.length,
      scores,
      failures,
    };
  }

  async getScoreHistory(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    limit?: number;
    before?: string;
  }): Promise<readonly OpportunityScoreHistoryEntry[]> {
    return this.repository.findHistory({
      tenantId: input.tenantId,
      workspaceId: input.workspaceId,
      opportunityId: input.opportunityId,
      limit: input.limit,
      before: input.before,
    });
  }
}
