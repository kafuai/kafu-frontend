import type {
  RevenueIntelligenceHistoryQuery,
  RevenueIntelligenceQuery,
  RevenueIntelligenceRequest,
  RevenueIntelligenceResult,
} from "./RevenueIntelligenceTypes";
import {
  RevenueIntelligenceRuntime,
} from "./RevenueIntelligenceRuntime";
import type {
  RevenueIntelligenceRepository,
} from "./RevenueIntelligenceRepository";

export interface RevenueIntelligenceServiceDependencies {
  runtime:
    RevenueIntelligenceRuntime;

  repository:
    RevenueIntelligenceRepository;
}

export class RevenueIntelligenceService {
  private readonly runtime:
    RevenueIntelligenceRuntime;

  private readonly repository:
    RevenueIntelligenceRepository;

  constructor(
    dependencies:
      RevenueIntelligenceServiceDependencies,
  ) {
    this.runtime =
      dependencies.runtime;

    this.repository =
      dependencies.repository;
  }

  async execute(
    request: RevenueIntelligenceRequest,
  ): Promise<RevenueIntelligenceResult> {
    return this.runtime.execute(
      request,
    );
  }

  async refresh(
    request: RevenueIntelligenceRequest,
  ): Promise<RevenueIntelligenceResult> {
    return this.runtime.execute({
      ...request,

      options: {
        ...request.options,
        forceRefresh: true,

        reason:
          request.options?.reason
          ?? "manual-refresh",
      },
    });
  }

  async getLatest(
    query: RevenueIntelligenceQuery,
  ): Promise<
    RevenueIntelligenceResult | null
  > {
    return this.runtime.getLatest(
      query,
    );
  }

  async getHistory(
    query:
      RevenueIntelligenceHistoryQuery,
  ): Promise<
    readonly RevenueIntelligenceResult[]
  > {
    return this.repository.findHistory(
      query,
    );
  }
}
