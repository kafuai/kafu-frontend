import type {
  SalesForecast,
  SalesForecastAuditRecord,
  SalesForecastChange,
  SalesForecastClock,
  SalesForecastConfiguration,
  SalesForecastEvent,
  SalesForecastIdGenerator,
  SalesForecastRequest,
} from "./SalesForecastTypes";
import {
  SalesForecastEngine,
} from "./SalesForecastEngine";
import {
  assertSalesForecastRepository,
  type SalesForecastRepository,
} from "./SalesForecastRepository";

export interface SalesForecastEventPublisher {
  publish(
    event: SalesForecastEvent,
  ): Promise<void>;
}

export interface SalesForecastAuditWriter {
  write(
    record: SalesForecastAuditRecord,
  ): Promise<void>;
}

export interface SalesForecastCache {
  get(
    key: string,
  ): Promise<SalesForecast | null>;

  set(
    key: string,
    forecast: SalesForecast,
    ttlMs: number,
  ): Promise<void>;

  delete(key: string): Promise<void>;
}

export interface SalesForecastRuntimeDependencies {
  engine: SalesForecastEngine;
  repository: SalesForecastRepository;

  cache?: SalesForecastCache;
  eventPublisher?:
    SalesForecastEventPublisher;
  auditWriter?:
    SalesForecastAuditWriter;

  clock?: SalesForecastClock;
  idGenerator?: SalesForecastIdGenerator;

  configuration?: Partial<
    SalesForecastConfiguration
  >;
}

const DEFAULT_CONFIGURATION:
  SalesForecastConfiguration = {
    modelVersion: "5.0.0",

    cacheTtlMs: 5 * 60 * 1000,

    minimumConfidence: 25,

    materialChangeThreshold: 5,

    healthyCoverageThreshold: 1,

    watchCoverageThreshold: 0.8,
  };

const systemClock:
  SalesForecastClock = {
    now: () => new Date(),
  };

const systemIdGenerator:
  SalesForecastIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class SalesForecastRuntime {
  private readonly engine:
    SalesForecastEngine;

  private readonly repository:
    SalesForecastRepository;

  private readonly cache?:
    SalesForecastCache;

  private readonly eventPublisher?:
    SalesForecastEventPublisher;

  private readonly auditWriter?:
    SalesForecastAuditWriter;

  private readonly clock:
    SalesForecastClock;

  private readonly idGenerator:
    SalesForecastIdGenerator;

  private readonly configuration:
    SalesForecastConfiguration;

  constructor(
    dependencies:
      SalesForecastRuntimeDependencies,
  ) {
    this.engine =
      dependencies.engine;

    this.repository =
      assertSalesForecastRepository(
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

  async getLatest(
    query: {
      tenantId: string;
      workspaceId?: string;
      period:
        SalesForecast["period"];
      periodStart: string;
      periodEnd: string;
    },
  ): Promise<SalesForecast | null> {
    const cacheKey =
      this.createCacheKey(query);

    const cached =
      await this.cache?.get(cacheKey);

    if (cached) {
      await this.writeAudit({
        tenantId:
          query.tenantId,

        workspaceId:
          query.workspaceId,

        action:
          "cache-hit",

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          period:
            query.period,

          periodStart:
            query.periodStart,

          periodEnd:
            query.periodEnd,
        },
      });

      return cached;
    }

    await this.writeAudit({
      tenantId:
        query.tenantId,

      workspaceId:
        query.workspaceId,

      action:
        "cache-miss",

      occurredAt:
        this.clock.now().toISOString(),

      details: {
        period:
          query.period,
      },
    });

    const forecast =
      await this.repository.findLatest(
        query,
      );

    if (
      forecast
      && this.cache
    ) {
      await this.cache.set(
        cacheKey,
        forecast,
        this.configuration.cacheTtlMs,
      );
    }

    return forecast;
  }

  async calculate(
    request: SalesForecastRequest,
  ): Promise<SalesForecast> {
    const { context } = request;

    const query = {
      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      period:
        context.period,

      periodStart:
        context.periodStart,

      periodEnd:
        context.periodEnd,
    };

    const previous =
      await this.repository.findLatest(
        query,
      );

    try {
      const calculated =
        this.engine.calculate(
          {
            ...context,

            previousForecastRevenue:
              context
                .previousForecastRevenue
              ?? previous
                ?.predictedRevenue,

            previousForecastConfidence:
              context
                .previousForecastConfidence
              ?? previous
                ?.confidence,
          },

          this.clock.now(),
        );

      const persisted =
        await this.repository.save({
          ...calculated,

          id:
            calculated.id
            ?? this.idGenerator.next(),
        });

      if (this.cache) {
        await this.cache.set(
          this.createCacheKey(query),

          persisted,

          this.configuration.cacheTtlMs,
        );
      }

      const change =
        this.calculateChange(
          previous,
          persisted,
        );

      await this.publishEvents(
        persisted,
        change,
        request.correlationId,
      );

      await this.writeAudit({
        tenantId:
          persisted.tenantId,

        workspaceId:
          persisted.workspaceId,

        action:
          request.forceRefresh
            ? "refresh"
            : "calculate",

        actorId:
          request.requestedBy,

        correlationId:
          request.correlationId,

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          period:
            persisted.period,

          periodStart:
            persisted.periodStart,

          periodEnd:
            persisted.periodEnd,

          pipelineValue:
            persisted.pipelineValue,

          predictedRevenue:
            persisted.predictedRevenue,

          weightedRevenue:
            persisted.weightedRevenue,

          confidence:
            persisted.confidence,

          health:
            persisted.health,

          trend:
            persisted.trend,

          delta:
            change.delta,

          deltaPercent:
            change.deltaPercent,

          materiallyChanged:
            change.materiallyChanged,
        },
      });

      if (
        persisted.health === "at-risk"
        || persisted.health === "critical"
      ) {
        await this.writeAudit({
          tenantId:
            persisted.tenantId,

          workspaceId:
            persisted.workspaceId,

          action: "at-risk",

          actorId:
            request.requestedBy,

          correlationId:
            request.correlationId,

          occurredAt:
            this.clock.now().toISOString(),

          details: {
            health:
              persisted.health,

            predictedRevenue:
              persisted.predictedRevenue,

            quota:
              persisted.quota,

            confidence:
              persisted.confidence,

            criticalRiskCount:
              persisted.riskSummary
                .criticalRiskCount,

            atRiskPredictedRevenue:
              persisted.riskSummary
                .atRiskPredictedRevenue,
          },
        });
      }

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown sales-forecast failure.";

      await this.writeAudit({
        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        action: "failure",

        actorId:
          request.requestedBy,

        correlationId:
          request.correlationId,

        occurredAt:
          this.clock.now().toISOString(),

        details: { message },
      });

      await this.eventPublisher?.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "sales-forecast.failed",

        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId:
          request.correlationId,

        payload: { message },
      });

      throw error;
    }
  }

  async recalculate(
    request: SalesForecastRequest,
  ): Promise<SalesForecast> {
    const query = {
      tenantId:
        request.context.tenantId,

      workspaceId:
        request.context.workspaceId,

      period:
        request.context.period,

      periodStart:
        request.context.periodStart,

      periodEnd:
        request.context.periodEnd,
    };

    await this.cache?.delete(
      this.createCacheKey(query),
    );

    return this.calculate({
      ...request,
      forceRefresh: true,
    });
  }

  private calculateChange(
    previous: SalesForecast | null,
    current: SalesForecast,
  ): SalesForecastChange {
    const previousForecastRevenue =
      previous?.predictedRevenue;

    const delta =
      previousForecastRevenue === undefined
        ? 0
        : current.predictedRevenue
          - previousForecastRevenue;

    const deltaPercent =
      previousForecastRevenue
      && previousForecastRevenue !== 0
        ? (
            delta
            / previousForecastRevenue
          ) * 100
        : undefined;

    return {
      previousForecastRevenue,

      currentForecastRevenue:
        current.predictedRevenue,

      delta,

      deltaPercent,

      materiallyChanged:
        previous === null
        || (
          deltaPercent !== undefined
          && Math.abs(deltaPercent)
            >= this.configuration
              .materialChangeThreshold
        )
        || previous.health
          !== current.health
        || previous.trend
          !== current.trend,
    };
  }

  private async publishEvents(
    forecast: SalesForecast,
    change: SalesForecastChange,
    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId:
        this.idGenerator.next(),

      eventType:
        "sales-forecast.calculated",

      tenantId:
        forecast.tenantId,

      workspaceId:
        forecast.workspaceId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId,

      payload: {
        period:
          forecast.period,

        periodStart:
          forecast.periodStart,

        periodEnd:
          forecast.periodEnd,

        pipelineValue:
          forecast.pipelineValue,

        predictedRevenue:
          forecast.predictedRevenue,

        weightedRevenue:
          forecast.weightedRevenue,

        quota:
          forecast.quota,

        attainmentRate:
          forecast.attainmentRate,

        coverageRatio:
          forecast.coverageRatio,

        confidence:
          forecast.confidence,

        health:
          forecast.health,

        trend:
          forecast.trend,

        modelVersion:
          forecast.modelVersion,
      },
    });

    if (change.materiallyChanged) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "sales-forecast.changed",

        tenantId:
          forecast.tenantId,

        workspaceId:
          forecast.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          previousForecastRevenue:
            change.previousForecastRevenue,

          currentForecastRevenue:
            change.currentForecastRevenue,

          delta:
            change.delta,

          deltaPercent:
            change.deltaPercent,

          health:
            forecast.health,

          trend:
            forecast.trend,
        },
      });
    }

    if (
      forecast.health === "at-risk"
      || forecast.health === "critical"
    ) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "sales-forecast.at-risk",

        tenantId:
          forecast.tenantId,

        workspaceId:
          forecast.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          health:
            forecast.health,

          predictedRevenue:
            forecast.predictedRevenue,

          quota:
            forecast.quota,

          attainmentRate:
            forecast.attainmentRate,

          confidence:
            forecast.confidence,

          criticalRiskCount:
            forecast.riskSummary
              .criticalRiskCount,

          atRiskPredictedRevenue:
            forecast.riskSummary
              .atRiskPredictedRevenue,

          topRiskOpportunityIds:
            forecast.riskSummary
              .topRiskOpportunityIds,
        },
      });
    }
  }

  private async writeAudit(
    record: SalesForecastAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(record);
  }

  private createCacheKey(
    query: {
      tenantId: string;
      workspaceId?: string;
      period:
        SalesForecast["period"];
      periodStart: string;
      periodEnd: string;
    },
  ): string {
    return [
      "ai-revenue-intelligence",
      "sales-forecast",
      query.tenantId,
      query.workspaceId ?? "default",
      query.period,
      query.periodStart,
      query.periodEnd,
    ].join(":");
  }
}
