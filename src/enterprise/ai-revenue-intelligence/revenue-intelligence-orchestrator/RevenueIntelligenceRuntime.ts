import type {
  RevenueIntelligenceAuditRecord,
  RevenueIntelligenceClock,
  RevenueIntelligenceConfiguration,
  RevenueIntelligenceEvent,
  RevenueIntelligenceIdGenerator,
  RevenueIntelligenceRequest,
  RevenueIntelligenceResult,
} from "./RevenueIntelligenceTypes";
import type {
  RevenueIntelligenceContextProvider,
} from "./RevenueIntelligenceContext";
import {
  RevenueIntelligenceOrchestrator,
} from "./RevenueIntelligenceOrchestrator";
import {
  assertRevenueIntelligenceRepository,
  type RevenueIntelligenceRepository,
} from "./RevenueIntelligenceRepository";

export interface RevenueIntelligenceEventPublisher {
  publish(
    event: RevenueIntelligenceEvent,
  ): Promise<void>;
}

export interface RevenueIntelligenceAuditWriter {
  write(
    record:
      RevenueIntelligenceAuditRecord,
  ): Promise<void>;
}

export interface RevenueIntelligenceCache {
  get(
    key: string,
  ): Promise<
    RevenueIntelligenceResult | null
  >;

  set(
    key: string,
    result: RevenueIntelligenceResult,
    ttlMs: number,
  ): Promise<void>;

  delete(key: string): Promise<void>;
}

export interface RevenueIntelligenceRuntimeDependencies {
  orchestrator:
    RevenueIntelligenceOrchestrator;

  contextProvider:
    RevenueIntelligenceContextProvider;

  repository:
    RevenueIntelligenceRepository;

  cache?: RevenueIntelligenceCache;

  eventPublisher?:
    RevenueIntelligenceEventPublisher;

  auditWriter?:
    RevenueIntelligenceAuditWriter;

  clock?: RevenueIntelligenceClock;

  idGenerator?:
    RevenueIntelligenceIdGenerator;

  configuration?: Partial<
    RevenueIntelligenceConfiguration
  >;
}

const DEFAULT_CONFIGURATION:
  RevenueIntelligenceConfiguration = {
    modelVersion: "5.0.0",

    cacheTtlMs: 5 * 60 * 1000,

    continueOnComponentFailure: true,

    maximumPipelineConcurrency: 5,

    healthyRiskThreshold: 25,
    watchRiskThreshold: 50,
    atRiskRiskThreshold: 75,

    minimumSnapshotConfidence: 25,
  };

const systemClock:
  RevenueIntelligenceClock = {
    now: () => new Date(),
  };

const systemIdGenerator:
  RevenueIntelligenceIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class RevenueIntelligenceRuntime {
  private readonly orchestrator:
    RevenueIntelligenceOrchestrator;

  private readonly contextProvider:
    RevenueIntelligenceContextProvider;

  private readonly repository:
    RevenueIntelligenceRepository;

  private readonly cache?:
    RevenueIntelligenceCache;

  private readonly eventPublisher?:
    RevenueIntelligenceEventPublisher;

  private readonly auditWriter?:
    RevenueIntelligenceAuditWriter;

  private readonly clock:
    RevenueIntelligenceClock;

  private readonly idGenerator:
    RevenueIntelligenceIdGenerator;

  private readonly configuration:
    RevenueIntelligenceConfiguration;

  constructor(
    dependencies:
      RevenueIntelligenceRuntimeDependencies,
  ) {
    this.orchestrator =
      dependencies.orchestrator;

    this.contextProvider =
      dependencies.contextProvider;

    this.repository =
      assertRevenueIntelligenceRepository(
        dependencies.repository,
      );

    this.cache =
      dependencies.cache;

    this.eventPublisher =
      dependencies.eventPublisher;

    this.auditWriter =
      dependencies.auditWriter;

    this.clock =
      dependencies.clock
      ?? systemClock;

    this.idGenerator =
      dependencies.idGenerator
      ?? systemIdGenerator;

    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...dependencies.configuration,
    };
  }

  async execute(
    request: RevenueIntelligenceRequest,
  ): Promise<RevenueIntelligenceResult> {
    const startedAt =
      this.clock.now();

    const tenantId =
      request.scope === "opportunity"
        ? request.opportunity.tenantId
        : request.tenantId;

    const workspaceId =
      request.scope === "opportunity"
        ? request.opportunity.workspaceId
        : request.workspaceId;

    const options =
      request.options ?? {};

    const correlationId =
      options.correlationId
      ?? this.idGenerator.next();

    const cacheKey =
      this.createCacheKey(
        request,
      );

    if (!options.forceRefresh) {
      const cached =
        await this.cache?.get(cacheKey);

      if (cached) {
        await this.writeAudit({
          tenantId,
          workspaceId,

          opportunityId:
            request.scope
              === "opportunity"
              ? request
                  .opportunity
                  .opportunityId
              : undefined,

          action: "cache-hit",

          actorId:
            options.requestedBy,

          correlationId,

          occurredAt:
            this.clock.now().toISOString(),

          details: {
            scope:
              request.scope,
          },
        });

        return cached;
      }
    }

    await this.eventPublisher?.publish({
      eventId:
        this.idGenerator.next(),

      eventType:
        "revenue-intelligence.started",

      tenantId,
      workspaceId,

      opportunityId:
        request.scope === "opportunity"
          ? request.opportunity
              .opportunityId
          : undefined,

      occurredAt:
        startedAt.toISOString(),

      correlationId,

      payload: {
        scope:
          request.scope,

        reason:
          options.reason,
      },
    });

    try {
      const result =
        request.scope === "opportunity"
          ? await this.executeOpportunity(
              request,
              startedAt,
              correlationId,
            )
          : request.scope === "pipeline"
            ? await this.executePipeline(
                request,
                startedAt,
                correlationId,
              )
            : await this.executeForecast(
                request,
                startedAt,
                correlationId,
              );

      const persisted =
        await this.repository.save(
          result,
        );

      await this.cache?.set(
        cacheKey,
        persisted,
        this.configuration.cacheTtlMs,
      );

      await this.publishCompletion(
        persisted,
      );

      await this.writeAudit({
        tenantId:
          persisted.tenantId,

        workspaceId:
          persisted.workspaceId,

        opportunityId:
          persisted
            .opportunitySnapshot
            ?.opportunityId,

        action:
          options.forceRefresh
            ? "refresh"
            : "execute",

        actorId:
          options.requestedBy,

        correlationId,

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          scope:
            persisted.scope,

          status:
            persisted.status,

          durationMs:
            persisted.durationMs,

          executionCount:
            persisted.executions.length,

          failedExecutionCount:
            persisted.executions.filter(
              (execution) =>
                execution.status
                === "failed",
            ).length,

          opportunityHealth:
            persisted
              .opportunitySnapshot
              ?.health,

          pipelineCriticalCount:
            persisted
              .pipelineSummary
              ?.criticalCount,

          forecastHealth:
            persisted
              .salesForecast
              ?.health,
        },
      });

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown revenue intelligence failure.";

      const opportunityId =
        request.scope === "opportunity"
          ? request.opportunity
              .opportunityId
          : undefined;

      await this.eventPublisher?.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "revenue-intelligence.failed",

        tenantId,
        workspaceId,
        opportunityId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          scope:
            request.scope,

          message,
        },
      });

      await this.writeAudit({
        tenantId,
        workspaceId,
        opportunityId,

        action: "failure",

        actorId:
          options.requestedBy,

        correlationId,

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          scope:
            request.scope,

          message,
        },
      });

      throw error;
    }
  }

  async getLatest(input: {
    tenantId: string;
    workspaceId?: string;

    scope:
      RevenueIntelligenceResult["scope"];

    opportunityId?: string;

    periodStart?: string;
    periodEnd?: string;
  }): Promise<
    RevenueIntelligenceResult | null
  > {
    return this.repository.findLatest(
      input,
    );
  }

  private async executeOpportunity(
    request: Extract<
      RevenueIntelligenceRequest,
      { scope: "opportunity" }
    >,
    startedAt: Date,
    correlationId: string,
  ): Promise<RevenueIntelligenceResult> {
    const source =
      await this.contextProvider
        .getOpportunitySource({
          tenantId:
            request.opportunity
              .tenantId,

          workspaceId:
            request.opportunity
              .workspaceId,

          opportunityId:
            request.opportunity
              .opportunityId,
        });

    const execution =
      await this.orchestrator
        .executeOpportunity(
          source,
          {
            ...request.options,
            correlationId,
          },
        );

    const completedAt =
      this.clock.now();

    const failedCount =
      execution.executions.filter(
        (item) =>
          item.status === "failed",
      ).length;

    const status =
      failedCount === 0
        ? "completed"
        : "partial";

    return {
      id:
        this.idGenerator.next(),

      tenantId:
        request.opportunity
          .tenantId,

      workspaceId:
        request.opportunity
          .workspaceId,

      scope: "opportunity",
      status,

      opportunitySnapshot:
        execution.snapshot,

      executions:
        execution.executions,

      startedAt:
        startedAt.toISOString(),

      completedAt:
        completedAt.toISOString(),

      durationMs:
        Math.max(
          0,
          completedAt.getTime()
          - startedAt.getTime(),
        ),

      modelVersion:
        this.configuration.modelVersion,

      correlationId,

      requestedBy:
        request.options
          ?.requestedBy,

      metadata: {
        reason:
          request.options?.reason,
      },
    };
  }

  private async executePipeline(
    request: Extract<
      RevenueIntelligenceRequest,
      { scope: "pipeline" }
    >,
    startedAt: Date,
    correlationId: string,
  ): Promise<RevenueIntelligenceResult> {
    const sources =
      await this.contextProvider
        .listOpportunitySources({
          tenantId:
            request.tenantId,

          workspaceId:
            request.workspaceId,

          opportunityIds:
            request.opportunityIds,

          currency:
            request.currency,
        });

    const snapshots = [];
    const executions = [];

    let failedOpportunityCount = 0;

    for (
      let index = 0;
      index < sources.length;
      index += this.configuration
        .maximumPipelineConcurrency
    ) {
      const batch =
        sources.slice(
          index,
          index
          + this.configuration
            .maximumPipelineConcurrency,
        );

      const batchResults =
        await Promise.allSettled(
          batch.map(
            (source) =>
              this.orchestrator
                .executeOpportunity(
                  source,
                  {
                    ...request.options,

                    correlationId,

                    includeSalesForecast:
                      false,
                  },
                ),
          ),
        );

      for (
        const result of batchResults
      ) {
        if (
          result.status === "fulfilled"
        ) {
          snapshots.push(
            result.value.snapshot,
          );

          executions.push(
            ...result.value.executions,
          );
        } else {
          failedOpportunityCount += 1;

          if (
            !this.configuration
              .continueOnComponentFailure
          ) {
            throw result.reason;
          }
        }
      }
    }

    const pipelineSummary =
      this.orchestrator
        .buildPipelineSummary(
          snapshots,
          {
            tenantId:
              request.tenantId,

            workspaceId:
              request.workspaceId,

            currency:
              request.currency,

            requestedOpportunityCount:
              sources.length,

            failedOpportunityCount,
          },
        );

    const completedAt =
      this.clock.now();

    return {
      id:
        this.idGenerator.next(),

      tenantId:
        request.tenantId,

      workspaceId:
        request.workspaceId,

      scope: "pipeline",

      status:
        failedOpportunityCount === 0
          ? "completed"
          : snapshots.length > 0
            ? "partial"
            : "failed",

      pipelineSummary,

      executions,

      startedAt:
        startedAt.toISOString(),

      completedAt:
        completedAt.toISOString(),

      durationMs:
        Math.max(
          0,
          completedAt.getTime()
          - startedAt.getTime(),
        ),

      modelVersion:
        this.configuration.modelVersion,

      correlationId,

      requestedBy:
        request.options
          ?.requestedBy,

      metadata: {
        requestedOpportunityIds:
          request.opportunityIds,

        reason:
          request.options?.reason,
      },
    };
  }

  private async executeForecast(
    request: Extract<
      RevenueIntelligenceRequest,
      { scope: "forecast" }
    >,
    startedAt: Date,
    correlationId: string,
  ): Promise<RevenueIntelligenceResult> {
    const forecastContext =
      await this.contextProvider
        .getSalesForecastContext({
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
        });

    const execution =
      await this.orchestrator
        .executeSalesForecast(
          forecastContext,
        );

    const completedAt =
      this.clock.now();

    return {
      id:
        this.idGenerator.next(),

      tenantId:
        request.tenantId,

      workspaceId:
        request.workspaceId,

      scope: "forecast",

      status: "completed",

      salesForecast:
        execution.forecast,

      executions: [
        execution.execution,
      ],

      startedAt:
        startedAt.toISOString(),

      completedAt:
        completedAt.toISOString(),

      durationMs:
        Math.max(
          0,
          completedAt.getTime()
          - startedAt.getTime(),
        ),

      modelVersion:
        this.configuration.modelVersion,

      correlationId,

      requestedBy:
        request.options
          ?.requestedBy,

      metadata: {
        period:
          request.period,

        periodStart:
          request.periodStart,

        periodEnd:
          request.periodEnd,

        reason:
          request.options?.reason,
      },
    };
  }

  private async publishCompletion(
    result: RevenueIntelligenceResult,
  ): Promise<void> {
    const eventType =
      result.status === "partial"
        ? "revenue-intelligence.partial"
        : "revenue-intelligence.completed";

    await this.eventPublisher?.publish({
      eventId:
        this.idGenerator.next(),

      eventType,

      tenantId:
        result.tenantId,

      workspaceId:
        result.workspaceId,

      opportunityId:
        result.opportunitySnapshot
          ?.opportunityId,

      occurredAt:
        result.completedAt,

      correlationId:
        result.correlationId,

      payload: {
        scope:
          result.scope,

        status:
          result.status,

        durationMs:
          result.durationMs,

        modelVersion:
          result.modelVersion,
      },
    });

    const isCritical =
      result.opportunitySnapshot
        ?.health === "critical"
      || (
        result.pipelineSummary
          ?.criticalCount
        ?? 0
      ) > 0
      || result.salesForecast
        ?.health === "critical";

    if (!isCritical) {
      return;
    }

    await this.eventPublisher?.publish({
      eventId:
        this.idGenerator.next(),

      eventType:
        "revenue-intelligence.critical",

      tenantId:
        result.tenantId,

      workspaceId:
        result.workspaceId,

      opportunityId:
        result.opportunitySnapshot
          ?.opportunityId,

      occurredAt:
        result.completedAt,

      correlationId:
        result.correlationId,

      payload: {
        scope:
          result.scope,

        opportunityHealth:
          result.opportunitySnapshot
            ?.health,

        pipelineCriticalCount:
          result.pipelineSummary
            ?.criticalCount,

        forecastHealth:
          result.salesForecast
            ?.health,

        revenueAtRisk:
          result.opportunitySnapshot
            ?.revenueAtRisk
          ?? result.pipelineSummary
            ?.revenueAtRisk
          ?? result.salesForecast
            ?.riskSummary
            .atRiskPredictedRevenue,
      },
    });

    await this.writeAudit({
      tenantId:
        result.tenantId,

      workspaceId:
        result.workspaceId,

      opportunityId:
        result.opportunitySnapshot
          ?.opportunityId,

      action: "critical",

      actorId:
        result.requestedBy,

      correlationId:
        result.correlationId,

      occurredAt:
        result.completedAt,

      details: {
        scope:
          result.scope,

        opportunityHealth:
          result.opportunitySnapshot
            ?.health,

        pipelineCriticalCount:
          result.pipelineSummary
            ?.criticalCount,

        forecastHealth:
          result.salesForecast
            ?.health,
      },
    });
  }

  private async writeAudit(
    record:
      RevenueIntelligenceAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(
      record,
    );
  }

  private createCacheKey(
    request: RevenueIntelligenceRequest,
  ): string {
    if (
      request.scope === "opportunity"
    ) {
      return [
        "ai-revenue-intelligence",
        "orchestrator",
        "opportunity",
        request.opportunity.tenantId,
        request.opportunity.workspaceId
          ?? "default",
        request.opportunity
          .opportunityId,
      ].join(":");
    }

    if (
      request.scope === "pipeline"
    ) {
      return [
        "ai-revenue-intelligence",
        "orchestrator",
        "pipeline",
        request.tenantId,
        request.workspaceId
          ?? "default",
        request.currency,
        (
          request.opportunityIds
          ?? []
        ).join(","),
      ].join(":");
    }

    return [
      "ai-revenue-intelligence",
      "orchestrator",
      "forecast",
      request.tenantId,
      request.workspaceId
        ?? "default",
      request.currency,
      request.period,
      request.periodStart,
      request.periodEnd,
    ].join(":");
  }
}
