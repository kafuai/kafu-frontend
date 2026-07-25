import type {
  SalesForecast,
  SalesForecastContext,
  SalesForecastHistoryQuery,
  SalesForecastQuery,
  SalesForecastRequest,
} from "./SalesForecastTypes";
import {
  SalesForecastRuntime,
} from "./SalesForecastRuntime";
import type {
  SalesForecastRepository,
} from "./SalesForecastRepository";

export interface SalesForecastContextProvider {
  getContext(
    query: SalesForecastQuery,
  ): Promise<SalesForecastContext>;
}

export interface SalesForecastServiceDependencies {
  runtime: SalesForecastRuntime;
  repository: SalesForecastRepository;
  contextProvider:
    SalesForecastContextProvider;
}

export class SalesForecastService {
  private readonly runtime:
    SalesForecastRuntime;

  private readonly repository:
    SalesForecastRepository;

  private readonly contextProvider:
    SalesForecastContextProvider;

  constructor(
    dependencies:
      SalesForecastServiceDependencies,
  ) {
    this.runtime =
      dependencies.runtime;

    this.repository =
      dependencies.repository;

    this.contextProvider =
      dependencies.contextProvider;
  }

  async getLatest(
    query: SalesForecastQuery,
  ): Promise<SalesForecast | null> {
    return this.runtime.getLatest(
      query,
    );
  }

  async calculate(
    request: SalesForecastRequest,
  ): Promise<SalesForecast> {
    return this.runtime.calculate(
      request,
    );
  }

  async calculateFromPeriod(input: {
    tenantId: string;
    workspaceId?: string;

    period:
      SalesForecastQuery["period"];

    periodStart: string;
    periodEnd: string;

    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<SalesForecast> {
    const query: SalesForecastQuery = {
      tenantId:
        input.tenantId,

      workspaceId:
        input.workspaceId,

      period:
        input.period,

      periodStart:
        input.periodStart,

      periodEnd:
        input.periodEnd,
    };

    const context =
      await this.contextProvider.getContext(
        query,
      );

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

    period:
      SalesForecastQuery["period"];

    periodStart: string;
    periodEnd: string;

    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<SalesForecast> {
    const query: SalesForecastQuery = {
      tenantId:
        input.tenantId,

      workspaceId:
        input.workspaceId,

      period:
        input.period,

      periodStart:
        input.periodStart,

      periodEnd:
        input.periodEnd,
    };

    const context =
      await this.contextProvider.getContext(
        query,
      );

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

  async getHistory(
    query: SalesForecastHistoryQuery,
  ): Promise<
    readonly SalesForecast[]
  > {
    return this.repository.findHistory(
      query,
    );
  }
}
