import {
  RevenuePredictionEngine,
} from "./RevenuePredictionEngine";
import {
  assertRevenuePredictionRepository,
} from "./RevenuePredictionRepository";
import type {
  RevenuePredictionRepository,
} from "./RevenuePredictionRepository";
import type {
  RevenuePredictionAuditRecord,
  RevenuePredictionClock,
  RevenuePredictionConfiguration,
  RevenuePredictionEvent,
  RevenuePredictionForecast,
  RevenuePredictionHistoryEntry,
  RevenuePredictionIdGenerator,
  RevenuePredictionQuery,
  RevenuePredictionRequest,
} from "./RevenuePredictionTypes";

export interface RevenuePredictionCache {
  get(
    key: string,
  ): Promise<
    RevenuePredictionForecast | null
  >;

  set(
    key: string,
    forecast: RevenuePredictionForecast,
    ttlMs: number,
  ): Promise<void>;

  delete(
    key: string,
  ): Promise<void>;
}

export interface RevenuePredictionEventPublisher {
  publish(
    event: RevenuePredictionEvent,
  ): Promise<void>;
}

export interface RevenuePredictionAuditWriter {
  write(
    record:
      RevenuePredictionAuditRecord,
  ): Promise<void>;
}

export interface RevenuePredictionRuntimeDependencies {
  engine: RevenuePredictionEngine;

  repository:
    RevenuePredictionRepository;

  cache?: RevenuePredictionCache;

  eventPublisher?:
    RevenuePredictionEventPublisher;

  auditWriter?:
    RevenuePredictionAuditWriter;

  clock?: RevenuePredictionClock;

  idGenerator?:
    RevenuePredictionIdGenerator;

  configuration?:
    Partial<RevenuePredictionConfiguration>;
}

const DEFAULT_CONFIGURATION:
  RevenuePredictionConfiguration = {
    modelVersion: "5.0.0",
    defaultCurrency: "USD",
    forecastTtlHours: 12,
    materialChangePercentage: 10,
    criticalTargetGapPercentage: 30,
    highTargetGapPercentage: 15,
    minimumConfidenceScore: 25,
    maximumHistoryEntries: 100,
  };

const systemClock:
  RevenuePredictionClock = {
    now: () => new Date(),
  };

const systemIdGenerator:
  RevenuePredictionIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class RevenuePredictionRuntime {
  private readonly engine:
    RevenuePredictionEngine;

  private readonly repository:
    RevenuePredictionRepository;

  private readonly cache?:
    RevenuePredictionCache;

  private readonly eventPublisher?:
    RevenuePredictionEventPublisher;

  private readonly auditWriter?:
    RevenuePredictionAuditWriter;

  private readonly clock:
    RevenuePredictionClock;

  private readonly idGenerator:
    RevenuePredictionIdGenerator;

  private readonly configuration:
    RevenuePredictionConfiguration;

  constructor(
    dependencies:
      RevenuePredictionRuntimeDependencies,
  ) {
    this.engine =
      dependencies.engine;

    this.repository =
      assertRevenuePredictionRepository(
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
    query: RevenuePredictionQuery,
  ): Promise<
    RevenuePredictionForecast | null
  > {
    const cacheKey =
      this.createCacheKey(query);

    const cached =
      await this.cache?.get(cacheKey);

    if (cached) {
      await this.writeAudit({
        tenantId: query.tenantId,
        workspaceId:
          query.workspaceId,
        action: "cache-hit",
        occurredAt:
          this.clock.now().toISOString(),
        details: {
          forecastId: cached.id,
          expectedRevenue:
            cached.expectedRevenue,
        },
      });

      return cached;
    }

    await this.writeAudit({
      tenantId: query.tenantId,
      workspaceId:
        query.workspaceId,
      action: "cache-miss",
      occurredAt:
        this.clock.now().toISOString(),
      details: {
        horizon: query.horizon,
        periodStart:
          query.periodStart,
        periodEnd:
          query.periodEnd,
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
        this.resolveCacheTtlMs(
          forecast,
        ),
      );
    }

    return forecast;
  }

  async generate(
    request: RevenuePredictionRequest,
  ): Promise<RevenuePredictionForecast> {
    const { context } = request;

    const query:
      RevenuePredictionQuery = {
        tenantId: context.tenantId,
        workspaceId:
          context.workspaceId,
        horizon: context.horizon,
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
      const generated =
        this.engine.generate(
          {
            ...context,
            previousForecast:
              context.previousForecast
              ?? previous?.expectedRevenue,
          },
          this.clock.now(),
        );

      const persisted =
        await this.repository.saveForecast({
          ...generated,
          id:
            generated.id
            || this.idGenerator.next(),
        });

      const historyEntry:
        RevenuePredictionHistoryEntry = {
          id:
            this.idGenerator.next(),

          forecastId:
            persisted.id,

          tenantId:
            persisted.tenantId,

          workspaceId:
            persisted.workspaceId,

          horizon:
            persisted.horizon,

          periodStart:
            persisted.periodStart,

          periodEnd:
            persisted.periodEnd,

          expectedRevenue:
            persisted.expectedRevenue,

          conservativeRevenue:
            persisted.conservative
              .predictedRevenue,

          optimisticRevenue:
            persisted.optimistic
              .predictedRevenue,

          confidenceScore:
            persisted.confidenceScore,

          targetRevenue:
            persisted.revenueTarget,

          targetGap:
            persisted.targetGap,

          generatedAt:
            persisted.generatedAt,

          reason:
            request.reason,
        };

      await this.repository.appendHistory(
        historyEntry,
      );

      const cacheKey =
        this.createCacheKey(query);

      if (this.cache) {
        await this.cache.set(
          cacheKey,
          persisted,
          this.resolveCacheTtlMs(
            persisted,
          ),
        );
      }

      const materialChange =
        this.isMaterialChange(
          previous,
          persisted,
        );

      await this.publishGeneratedEvents(
        previous,
        persisted,
        materialChange,
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
            : "generate",

        actorId:
          request.requestedBy,

        correlationId:
          request.correlationId,

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          forecastId:
            persisted.id,

          expectedRevenue:
            persisted.expectedRevenue,

          confidenceScore:
            persisted.confidenceScore,

          targetGap:
            persisted.targetGap,

          materialChange,
        },
      });

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown revenue prediction failure.";

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

        details: {
          message,
        },
      });

      await this.eventPublisher?.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "revenue-prediction.failed",

        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId:
          request.correlationId,

        payload: {
          message,
          horizon:
            context.horizon,
          periodStart:
            context.periodStart,
          periodEnd:
            context.periodEnd,
        },
      });

      throw error;
    }
  }

  async regenerate(
    request: RevenuePredictionRequest,
  ): Promise<RevenuePredictionForecast> {
    const query:
      RevenuePredictionQuery = {
        tenantId:
          request.context.tenantId,

        workspaceId:
          request.context.workspaceId,

        horizon:
          request.context.horizon,

        periodStart:
          request.context.periodStart,

        periodEnd:
          request.context.periodEnd,
      };

    await this.cache?.delete(
      this.createCacheKey(query),
    );

    return this.generate({
      ...request,
      forceRefresh: true,
      reason:
        request.reason
        ?? "manual-regeneration",
    });
  }

  private async publishGeneratedEvents(
    previous:
      RevenuePredictionForecast | null,
    current:
      RevenuePredictionForecast,
    materialChange: boolean,
    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId:
        this.idGenerator.next(),

      eventType:
        "revenue-prediction.generated",

      tenantId:
        current.tenantId,

      workspaceId:
        current.workspaceId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId,

      payload: {
        forecastId:
          current.id,

        horizon:
          current.horizon,

        periodStart:
          current.periodStart,

        periodEnd:
          current.periodEnd,

        expectedRevenue:
          current.expectedRevenue,

        conservativeRevenue:
          current.conservative
            .predictedRevenue,

        optimisticRevenue:
          current.optimistic
            .predictedRevenue,

        targetRevenue:
          current.revenueTarget,

        targetGap:
          current.targetGap,

        confidenceScore:
          current.confidenceScore,

        managementAttentionRequired:
          current.managementAttentionRequired,

        modelVersion:
          current.modelVersion,
      },
    });

    if (materialChange) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "revenue-prediction.material-change",

        tenantId:
          current.tenantId,

        workspaceId:
          current.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          previousForecastId:
            previous?.id,

          currentForecastId:
            current.id,

          previousExpectedRevenue:
            previous?.expectedRevenue,

          currentExpectedRevenue:
            current.expectedRevenue,

          previousConfidenceScore:
            previous?.confidenceScore,

          currentConfidenceScore:
            current.confidenceScore,

          previousTargetGap:
            previous?.targetGap,

          currentTargetGap:
            current.targetGap,
        },
      });
    }

    if (
      current.summary.targetStatus
        === "critical"
      || current.summary.targetStatus
        === "at-risk"
    ) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "revenue-prediction.target-risk",

        tenantId:
          current.tenantId,

        workspaceId:
          current.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          forecastId:
            current.id,

          targetStatus:
            current.summary.targetStatus,

          targetRevenue:
            current.revenueTarget,

          expectedRevenue:
            current.expectedRevenue,

          targetGap:
            current.targetGap,

          targetAttainmentPercentage:
            current.targetAttainmentPercentage,

          risks:
            current.risks.map(
              (risk) => ({
                key: risk.key,
                level: risk.level,
                title: risk.title,
              }),
            ),
        },
      });
    }
  }

  private isMaterialChange(
    previous:
      RevenuePredictionForecast | null,
    current:
      RevenuePredictionForecast,
  ): boolean {
    if (!previous) {
      return true;
    }

    if (
      previous.expectedRevenue === 0
    ) {
      return (
        current.expectedRevenue !== 0
      );
    }

    const change =
      Math.abs(
        (
          current.expectedRevenue
          - previous.expectedRevenue
        )
        / previous.expectedRevenue
        * 100,
      );

    if (
      change
      >= this.configuration
        .materialChangePercentage
    ) {
      return true;
    }

    if (
      previous.summary.targetStatus
      !== current.summary.targetStatus
    ) {
      return true;
    }

    if (
      previous.managementAttentionRequired
      !== current.managementAttentionRequired
    ) {
      return true;
    }

    return false;
  }

  private resolveCacheTtlMs(
    forecast:
      RevenuePredictionForecast,
  ): number {
    const expiresAt =
      new Date(
        forecast.expiresAt,
      ).getTime();

    const remaining =
      expiresAt
      - this.clock.now().getTime();

    if (
      Number.isFinite(remaining)
      && remaining > 0
    ) {
      return remaining;
    }

    return (
      this.configuration
        .forecastTtlHours
      * 60
      * 60
      * 1000
    );
  }

  private createCacheKey(
    query: RevenuePredictionQuery,
  ): string {
    return [
      "ai-revenue-intelligence",
      "revenue-prediction",
      query.tenantId,
      query.workspaceId
        ?? "default",
      query.horizon,
      query.periodStart,
      query.periodEnd,
    ].join(":");
  }

  private async writeAudit(
    record:
      RevenuePredictionAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(
      record,
    );
  }
}

export const createRevenuePredictionRuntime = (
  dependencies:
    RevenuePredictionRuntimeDependencies,
): RevenuePredictionRuntime =>
  new RevenuePredictionRuntime(
    dependencies,
  );
