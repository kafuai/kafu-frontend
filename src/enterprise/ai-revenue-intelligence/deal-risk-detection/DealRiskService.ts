import type {
  DealRiskAssessment,
  DealRiskBatchRequest,
  DealRiskBatchResult,
  DealRiskContext,
  DealRiskHistoryEntry,
  DealRiskRequest,
} from "./DealRiskTypes";
import {
  DealRiskRuntime,
} from "./DealRiskRuntime";
import type {
  DealRiskRepository,
} from "./DealRiskRepository";

export interface DealRiskContextProvider {
  getContext(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
  }): Promise<DealRiskContext>;
}

export interface DealRiskServiceDependencies {
  runtime: DealRiskRuntime;
  repository: DealRiskRepository;
  contextProvider: DealRiskContextProvider;
}

export class DealRiskService {
  private readonly runtime:
    DealRiskRuntime;

  private readonly repository:
    DealRiskRepository;

  private readonly contextProvider:
    DealRiskContextProvider;

  constructor(
    dependencies:
      DealRiskServiceDependencies,
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
    opportunityId: string;
  }): Promise<DealRiskAssessment | null> {
    return this.runtime.getLatest(
      input.tenantId,
      input.opportunityId,
      input.workspaceId,
    );
  }

  async calculate(
    request: DealRiskRequest,
  ): Promise<DealRiskAssessment> {
    return this.runtime.calculate(
      request,
    );
  }

  async calculateFromOpportunity(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<DealRiskAssessment> {
    const context =
      await this.contextProvider.getContext({
        tenantId:
          input.tenantId,

        workspaceId:
          input.workspaceId,

        opportunityId:
          input.opportunityId,
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
    opportunityId: string;
    requestedBy?: string;
    correlationId?: string;
    reason?: string;
  }): Promise<DealRiskAssessment> {
    const context =
      await this.contextProvider.getContext({
        tenantId:
          input.tenantId,

        workspaceId:
          input.workspaceId,

        opportunityId:
          input.opportunityId,
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

  async refreshBatch(
    request: DealRiskBatchRequest,
  ): Promise<DealRiskBatchResult> {
    const assessments:
      DealRiskAssessment[] = [];

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
        const assessment =
          await this.recalculate({
            tenantId:
              request.tenantId,

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

        assessments.push(
          assessment,
        );
      } catch (error) {
        failures.push({
          opportunityId,

          code:
            "DEAL_RISK_CALCULATION_FAILED",

          message:
            error instanceof Error
              ? error.message
              : "Unknown deal-risk failure.",
        });
      }
    }

    return {
      requested:
        request.opportunityIds.length,

      succeeded:
        assessments.length,

      failed:
        failures.length,

      assessments,
      failures,

      lowRiskCount:
        assessments.filter(
          (assessment) =>
            assessment.riskLevel === "low",
        ).length,

      moderateRiskCount:
        assessments.filter(
          (assessment) =>
            assessment.riskLevel
            === "moderate",
        ).length,

      highRiskCount:
        assessments.filter(
          (assessment) =>
            assessment.riskLevel === "high",
        ).length,

      criticalRiskCount:
        assessments.filter(
          (assessment) =>
            assessment.riskLevel
            === "critical",
        ).length,
    };
  }

  async getHistory(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    limit?: number;
    before?: string;
  }): Promise<
    readonly DealRiskHistoryEntry[]
  > {
    return this.repository.findHistory({
      tenantId:
        input.tenantId,

      workspaceId:
        input.workspaceId,

      opportunityId:
        input.opportunityId,

      limit:
        input.limit,

      before:
        input.before,
    });
  }
}
