import type {
  PredictiveRiskAssessment,
  PredictiveRiskContext,
  PredictiveRiskHistoryEntry,
  PredictiveRiskHistoryQuery,
  PredictiveRiskQuery,
  PredictiveRiskRequest,
} from "./PredictiveRiskTypes";
import {
  PredictiveRiskRuntime,
} from "./PredictiveRiskRuntime";
import type {
  PredictiveRiskRepository,
} from "./PredictiveRiskRepository";

export interface PredictiveRiskContextProvider {
  getContext(
    input:
      PredictiveRiskQuery,
  ): Promise<PredictiveRiskContext>;
}

export interface PredictiveRiskServiceDependencies {
  runtime:
    PredictiveRiskRuntime;

  repository:
    PredictiveRiskRepository;

  contextProvider:
    PredictiveRiskContextProvider;
}

export class PredictiveRiskService {
  private readonly runtime:
    PredictiveRiskRuntime;

  private readonly repository:
    PredictiveRiskRepository;

  private readonly contextProvider:
    PredictiveRiskContextProvider;

  constructor(
    dependencies:
      PredictiveRiskServiceDependencies,
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
      PredictiveRiskQuery,
  ): Promise<
    PredictiveRiskAssessment | null
  > {
    return this.runtime.getLatest(
      query,
    );
  }

  async generate(
    request:
      PredictiveRiskRequest,
  ): Promise<PredictiveRiskAssessment> {
    return this.runtime.generate(
      request,
    );
  }

  async generateForPeriod(
    input:
      PredictiveRiskQuery & {
        requestedBy?: string;
        correlationId?: string;
        reason?: string;
      },
  ): Promise<PredictiveRiskAssessment> {
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
      PredictiveRiskQuery & {
        requestedBy?: string;
        correlationId?: string;
        reason?: string;
      },
  ): Promise<PredictiveRiskAssessment> {
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
      PredictiveRiskHistoryQuery,
  ): Promise<
    readonly PredictiveRiskHistoryEntry[]
  > {
    return this.repository.findHistory(
      query,
    );
  }

  async deleteAssessment(
    query:
      PredictiveRiskQuery,
  ): Promise<void> {
    await this.repository
      .deleteAssessment(query);
  }
}

export const createPredictiveRiskService = (
  dependencies:
    PredictiveRiskServiceDependencies,
): PredictiveRiskService =>
  new PredictiveRiskService(
    dependencies,
  );
