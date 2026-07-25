import type {
  RevenueIntelligenceExecutionOptions,
  RevenueIntelligenceResult,
} from "../../../src/enterprise/ai-revenue-intelligence/revenue-intelligence-orchestrator/RevenueIntelligenceTypes";
import {
  RevenueIntelligenceService,
} from "../../../src/enterprise/ai-revenue-intelligence/revenue-intelligence-orchestrator/RevenueIntelligenceService";
import type {
  ExecutiveRevenueDashboard,
} from "../models/ExecutiveRevenueDashboard";
import {
  selectExecutiveRevenueDashboard,
} from "../selectors/revenue-dashboard.selector";

export interface ExecutiveRevenueDashboardRequest {
  tenantId: string;
  workspaceId: string;
  currency: string;

  opportunityIds?: readonly string[];

  period:
    | "week"
    | "month"
    | "quarter"
    | "year"
    | "custom";

  periodStart: string;
  periodEnd: string;

  options?: RevenueIntelligenceExecutionOptions;
}

export interface ExecutiveRevenueAdapterResult {
  dashboard: ExecutiveRevenueDashboard;

  pipelineResult: RevenueIntelligenceResult;
  forecastResult: RevenueIntelligenceResult;

  opportunityResults:
    readonly RevenueIntelligenceResult[];
}

export interface ExecutiveRevenueAdapterDependencies {
  revenueIntelligenceService:
    RevenueIntelligenceService;
}

export class ExecutiveRevenueAdapter {
  private readonly revenueIntelligenceService:
    RevenueIntelligenceService;

  constructor(
    dependencies:
      ExecutiveRevenueAdapterDependencies,
  ) {
    this.revenueIntelligenceService =
      dependencies.revenueIntelligenceService;
  }

  async loadDashboard(
    request:
      ExecutiveRevenueDashboardRequest,
  ): Promise<ExecutiveRevenueAdapterResult> {
    const [
      pipelineResult,
      forecastResult,
    ] = await Promise.all([
      this.revenueIntelligenceService.execute({
        scope: "pipeline",

        tenantId:
          request.tenantId,

        workspaceId:
          request.workspaceId,

        opportunityIds:
          request.opportunityIds,

        currency:
          request.currency,

        options: {
          ...request.options,

          includeNextBestAction: true,
          includeSalesForecast: false,

          reason:
            request.options?.reason
            ?? "executive-revenue-dashboard",
        },
      }),

      this.revenueIntelligenceService.execute({
        scope: "forecast",

        tenantId:
          request.tenantId,

        workspaceId:
          request.workspaceId,

        currency:
          request.currency,

        period:
          request.period,

        periodStart:
          request.periodStart,

        periodEnd:
          request.periodEnd,

        options: {
          ...request.options,

          includeNextBestAction: false,
          includeSalesForecast: true,

          reason:
            request.options?.reason
            ?? "executive-revenue-dashboard",
        },
      }),
    ]);

    const opportunityIds =
      this.collectExecutiveOpportunityIds(
        pipelineResult,
      );

    const opportunityResults =
      await this.loadOpportunityResults({
        tenantId:
          request.tenantId,

        workspaceId:
          request.workspaceId,

        opportunityIds,
      });

    const dashboard =
      selectExecutiveRevenueDashboard({
        workspaceId:
          request.workspaceId,

        pipelineResult,
        forecastResult,
        opportunityResults,
      });

    return {
      dashboard,
      pipelineResult,
      forecastResult,
      opportunityResults,
    };
  }

  async refreshDashboard(
    request:
      ExecutiveRevenueDashboardRequest,
  ): Promise<ExecutiveRevenueAdapterResult> {
    return this.loadDashboard({
      ...request,

      options: {
        ...request.options,

        forceRefresh: true,

        reason:
          request.options?.reason
          ?? "executive-revenue-dashboard-refresh",
      },
    });
  }

  private collectExecutiveOpportunityIds(
    pipelineResult:
      RevenueIntelligenceResult,
  ): readonly string[] {
    const summary =
      pipelineResult.pipelineSummary;

    if (!summary) {
      return [];
    }

    return Array.from(
      new Set([
        ...summary.topOpportunityIds,
        ...summary.topRiskOpportunityIds,
      ]),
    );
  }

  private async loadOpportunityResults(
    input: {
      tenantId: string;
      workspaceId: string;
      opportunityIds: readonly string[];
    },
  ): Promise<
    readonly RevenueIntelligenceResult[]
  > {
    if (input.opportunityIds.length === 0) {
      return [];
    }

    const results =
      await Promise.all(
        input.opportunityIds.map(
          (opportunityId) =>
            this.revenueIntelligenceService
              .getLatest({
                tenantId:
                  input.tenantId,

                workspaceId:
                  input.workspaceId,

                scope:
                  "opportunity",

                opportunityId,
              }),
        ),
      );

    return results.filter(
      (
        result,
      ): result is RevenueIntelligenceResult =>
        result !== null
        && result.opportunitySnapshot
          !== undefined,
    );
  }
}
