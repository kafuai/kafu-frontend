import type {
  PipelineHealthAssessment,
  PipelineHealthContext,
  PipelineHealthHistoryEntry,
  PipelineHealthRequest,
} from "./PipelineHealthTypes";
import {
  PipelineHealthRuntime,
} from "./PipelineHealthRuntime";
import type {
  PipelineHealthRepository,
} from "./PipelineHealthRepository";

export interface PipelineHealthContextProvider {
  getContext(input: {
    tenantId: string;
    workspaceId?: string;
    pipelineId?: string;
  }): Promise<PipelineHealthContext>;
}

export interface PipelineHealthServiceDependencies {
  runtime: PipelineHealthRuntime;
  repository:
    PipelineHealthRepository;
  contextProvider:
    PipelineHealthContextProvider;
}

export class PipelineHealthService {
  private readonly runtime:
    PipelineHealthRuntime;

  private readonly repository:
    PipelineHealthRepository;

  private readonly contextProvider:
    PipelineHealthContextProvider;

  constructor(
    dependencies:
      PipelineHealthServiceDependencies,
  ) {
    this.runtime =
      dependencies.runtime;

    this.repository =
      dependencies.repository;

    this.contextProvider =
      dependencies.contextProvider;
  }

  async getLatestAssessment(input: {
    tenantId: string;
    workspaceId?: string;
    pipelineId?: string;
  }): Promise<
    PipelineHealthAssessment | null
  > {
    return this.runtime.getLatest(
      input.tenantId,
      input.pipelineId,
      input.workspaceId,
    );
  }

  async calculate(
    request: PipelineHealthRequest,
  ): Promise<PipelineHealthAssessment> {
    return this.runtime.calculate(
      request,
    );
  }

  async calculateFromPipeline(input: {
    tenantId: string;
    workspaceId?: string;
    pipelineId?: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<PipelineHealthAssessment> {
    const context =
      await this.contextProvider.getContext({
        tenantId:
          input.tenantId,
        workspaceId:
          input.workspaceId,
        pipelineId:
          input.pipelineId,
      });

    return this.runtime.calculate({
      context,
      requestedBy:
        input.requestedBy,
      correlationId:
        input.correlationId,
      reason:
        input.reason,
    });
  }

  async recalculate(input: {
    tenantId: string;
    workspaceId?: string;
    pipelineId?: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<PipelineHealthAssessment> {
    const context =
      await this.contextProvider.getContext({
        tenantId:
          input.tenantId,
        workspaceId:
          input.workspaceId,
        pipelineId:
          input.pipelineId,
      });

    return this.runtime.recalculate({
      context,
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

  async getHistory(input: {
    tenantId: string;
    workspaceId?: string;
    pipelineId?: string;
    limit?: number;
    before?: string;
  }): Promise<
    readonly PipelineHealthHistoryEntry[]
  > {
    return this.repository.findHistory({
      tenantId:
        input.tenantId,
      workspaceId:
        input.workspaceId,
      pipelineId:
        input.pipelineId,
      limit:
        input.limit,
      before:
        input.before,
    });
  }
}
