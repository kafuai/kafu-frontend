import type {
  ExecutiveAIInsightBriefing,
  ExecutiveAIInsightContext,
  ExecutiveAIInsightHistoryEntry,
  ExecutiveAIInsightHistoryQuery,
  ExecutiveAIInsightQuery,
  ExecutiveAIInsightRequest,
} from "./ExecutiveAIInsightTypes";
import {
  ExecutiveAIInsightRuntime,
} from "./ExecutiveAIInsightRuntime";
import type {
  ExecutiveAIInsightRepository,
} from "./ExecutiveAIInsightRepository";

export interface ExecutiveAIInsightContextProvider {
  getContext(
    input:
      ExecutiveAIInsightQuery,
  ): Promise<ExecutiveAIInsightContext>;
}

export interface ExecutiveAIInsightServiceDependencies {
  runtime:
    ExecutiveAIInsightRuntime;

  repository:
    ExecutiveAIInsightRepository;

  contextProvider:
    ExecutiveAIInsightContextProvider;
}

export class ExecutiveAIInsightService {
  private readonly runtime:
    ExecutiveAIInsightRuntime;

  private readonly repository:
    ExecutiveAIInsightRepository;

  private readonly contextProvider:
    ExecutiveAIInsightContextProvider;

  constructor(
    dependencies:
      ExecutiveAIInsightServiceDependencies,
  ) {
    this.runtime =
      dependencies.runtime;

    this.repository =
      dependencies.repository;

    this.contextProvider =
      dependencies.contextProvider;
  }

  async getLatest(
    query:
      ExecutiveAIInsightQuery,
  ): Promise<
    ExecutiveAIInsightBriefing | null
  > {
    return this.runtime.getLatest(
      query,
    );
  }

  async generate(
    request:
      ExecutiveAIInsightRequest,
  ): Promise<ExecutiveAIInsightBriefing> {
    return this.runtime.generate(
      request,
    );
  }

  async generateForPeriod(
    input:
      ExecutiveAIInsightQuery & {
        requestedBy?: string;
        correlationId?: string;
        reason?: string;
      },
  ): Promise<ExecutiveAIInsightBriefing> {
    const context =
      await this.contextProvider
        .getContext(input);

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

  async regenerateForPeriod(
    input:
      ExecutiveAIInsightQuery & {
        requestedBy?: string;
        correlationId?: string;
        reason?: string;
      },
  ): Promise<ExecutiveAIInsightBriefing> {
    const context =
      await this.contextProvider
        .getContext(input);

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

  async getHistory(
    query:
      ExecutiveAIInsightHistoryQuery,
  ): Promise<
    readonly ExecutiveAIInsightHistoryEntry[]
  > {
    return this.repository.findHistory(
      query,
    );
  }

  async deleteBriefing(
    query:
      ExecutiveAIInsightQuery,
  ): Promise<void> {
    await this.repository
      .deleteBriefing(query);
  }
}

export const createExecutiveAIInsightService = (
  dependencies:
    ExecutiveAIInsightServiceDependencies,
): ExecutiveAIInsightService =>
  new ExecutiveAIInsightService(
    dependencies,
  );
