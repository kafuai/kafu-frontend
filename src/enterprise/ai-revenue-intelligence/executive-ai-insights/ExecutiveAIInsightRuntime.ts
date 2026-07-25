import {
  ExecutiveAIInsightEngine,
} from "./ExecutiveAIInsightEngine";
import {
  assertExecutiveAIInsightRepository,
} from "./ExecutiveAIInsightRepository";
import type {
  ExecutiveAIInsightRepository,
} from "./ExecutiveAIInsightRepository";
import type {
  ExecutiveAIInsightAuditRecord,
  ExecutiveAIInsightBriefing,
  ExecutiveAIInsightClock,
  ExecutiveAIInsightConfiguration,
  ExecutiveAIInsightEvent,
  ExecutiveAIInsightHistoryEntry,
  ExecutiveAIInsightIdGenerator,
  ExecutiveAIInsightQuery,
  ExecutiveAIInsightRequest,
} from "./ExecutiveAIInsightTypes";

export interface ExecutiveAIInsightCache {
  get(
    key: string,
  ): Promise<
    ExecutiveAIInsightBriefing | null
  >;

  set(
    key: string,
    briefing:
      ExecutiveAIInsightBriefing,
    ttlMs: number,
  ): Promise<void>;

  delete(
    key: string,
  ): Promise<void>;
}

export interface ExecutiveAIInsightEventPublisher {
  publish(
    event:
      ExecutiveAIInsightEvent,
  ): Promise<void>;
}

export interface ExecutiveAIInsightAuditWriter {
  write(
    record:
      ExecutiveAIInsightAuditRecord,
  ): Promise<void>;
}

export interface ExecutiveAIInsightRuntimeDependencies {
  engine:
    ExecutiveAIInsightEngine;

  repository:
    ExecutiveAIInsightRepository;

  cache?:
    ExecutiveAIInsightCache;

  eventPublisher?:
    ExecutiveAIInsightEventPublisher;

  auditWriter?:
    ExecutiveAIInsightAuditWriter;

  clock?:
    ExecutiveAIInsightClock;

  idGenerator?:
    ExecutiveAIInsightIdGenerator;

  configuration?:
    Partial<ExecutiveAIInsightConfiguration>;
}

const DEFAULT_CONFIGURATION:
  ExecutiveAIInsightConfiguration = {
    modelVersion: "5.0.0",
    briefingTtlHours: 12,

    maximumInsights: 16,
    maximumRecommendations: 12,
    maximumBoardHighlights: 8,

    criticalRevenueGapPercentage: 30,
    highRevenueGapPercentage: 15,

    criticalPipelineHealthScore: 40,
    highPipelineHealthScore: 55,

    materialForecastChangePercentage: 10,
    materialPipelineScoreChange: 10,
  };

const systemClock:
  ExecutiveAIInsightClock = {
    now: () => new Date(),
  };

const systemIdGenerator:
  ExecutiveAIInsightIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class ExecutiveAIInsightRuntime {
  private readonly engine:
    ExecutiveAIInsightEngine;

  private readonly repository:
    ExecutiveAIInsightRepository;

  private readonly cache?:
    ExecutiveAIInsightCache;

  private readonly eventPublisher?:
    ExecutiveAIInsightEventPublisher;

  private readonly auditWriter?:
    ExecutiveAIInsightAuditWriter;

  private readonly clock:
    ExecutiveAIInsightClock;

  private readonly idGenerator:
    ExecutiveAIInsightIdGenerator;

  private readonly configuration:
    ExecutiveAIInsightConfiguration;

  constructor(
    dependencies:
      ExecutiveAIInsightRuntimeDependencies,
  ) {
    this.engine =
      dependencies.engine;

    this.repository =
      assertExecutiveAIInsightRepository(
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
    query:
      ExecutiveAIInsightQuery,
  ): Promise<
    ExecutiveAIInsightBriefing | null
  > {
    const cacheKey =
      this.createCacheKey(query);

    const cached =
      await this.cache?.get(
        cacheKey,
      );

    if (cached) {
      await this.writeAudit({
        tenantId:
          query.tenantId,

        workspaceId:
          query.workspaceId,

        action: "cache-hit",

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          briefingId:
            cached.id,

          executiveScore:
            cached.executiveScore,

          criticalInsightCount:
            cached.criticalInsightCount,
        },
      });

      return cached;
    }

    await this.writeAudit({
      tenantId:
        query.tenantId,

      workspaceId:
        query.workspaceId,

      action: "cache-miss",

      occurredAt:
        this.clock.now().toISOString(),

      details: {
        periodStart:
          query.periodStart,

        periodEnd:
          query.periodEnd,
      },
    });

    const briefing =
      await this.repository.findLatest(
        query,
      );

    if (
      briefing
      && this.cache
    ) {
      await this.cache.set(
        cacheKey,
        briefing,
        this.resolveCacheTtlMs(
          briefing,
        ),
      );
    }

    return briefing;
  }

  async generate(
    request:
      ExecutiveAIInsightRequest,
  ): Promise<ExecutiveAIInsightBriefing> {
    const { context } = request;

    const query:
      ExecutiveAIInsightQuery = {
        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

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
          context,
          this.clock.now(),
          request.correlationId,
        );

      const briefingId =
        generated.id
        || this.idGenerator.next();

      const persisted =
        await this.repository.saveBriefing({
          ...generated,

          id: briefingId,

          insights:
            generated.insights.map(
              (insight) => ({
                ...insight,

                id:
                  insight.id
                  || this.idGenerator.next(),
              }),
            ),

          recommendations:
            generated.recommendations.map(
              (recommendation) => ({
                ...recommendation,

                id:
                  recommendation.id
                  || this.idGenerator.next(),
              }),
            ),
        });

      const historyEntry:
        ExecutiveAIInsightHistoryEntry = {
          id:
            this.idGenerator.next(),

          briefingId:
            persisted.id,

          tenantId:
            persisted.tenantId,

          workspaceId:
            persisted.workspaceId,

          periodStart:
            persisted.periodStart,

          periodEnd:
            persisted.periodEnd,

          executiveScore:
            persisted.executiveScore,

          executiveStatus:
            persisted.summary
              .executiveStatus,

          criticalInsightCount:
            persisted.criticalInsightCount,

          highInsightCount:
            persisted.highInsightCount,

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

      await this.publishEvents(
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
          briefingId:
            persisted.id,

          executiveScore:
            persisted.executiveScore,

          executiveStatus:
            persisted.summary
              .executiveStatus,

          insightCount:
            persisted.insights.length,

          recommendationCount:
            persisted.recommendations.length,

          criticalInsightCount:
            persisted.criticalInsightCount,

          managementAttentionRequired:
            persisted.managementAttentionRequired,

          materialChange,
        },
      });

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown executive AI insight failure.";

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
          "executive-ai-insights.failed",

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
    request:
      ExecutiveAIInsightRequest,
  ): Promise<ExecutiveAIInsightBriefing> {
    const query:
      ExecutiveAIInsightQuery = {
        tenantId:
          request.context.tenantId,

        workspaceId:
          request.context.workspaceId,

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

  private async publishEvents(
    previous:
      ExecutiveAIInsightBriefing | null,
    current:
      ExecutiveAIInsightBriefing,
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
        "executive-ai-insights.generated",

      tenantId:
        current.tenantId,

      workspaceId:
        current.workspaceId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId,

      payload: {
        briefingId:
          current.id,

        executiveScore:
          current.executiveScore,

        executiveStatus:
          current.summary
            .executiveStatus,

        insightCount:
          current.insights.length,

        recommendationCount:
          current.recommendations.length,

        criticalInsightCount:
          current.criticalInsightCount,

        highInsightCount:
          current.highInsightCount,

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
          "executive-ai-insights.material-change",

        tenantId:
          current.tenantId,

        workspaceId:
          current.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          previousBriefingId:
            previous?.id,

          currentBriefingId:
            current.id,

          previousExecutiveScore:
            previous?.executiveScore,

          currentExecutiveScore:
            current.executiveScore,

          previousExecutiveStatus:
            previous?.summary
              .executiveStatus,

          currentExecutiveStatus:
            current.summary
              .executiveStatus,

          previousCriticalInsightCount:
            previous?.criticalInsightCount,

          currentCriticalInsightCount:
            current.criticalInsightCount,
        },
      });
    }

    if (
      current.criticalInsightCount > 0
    ) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "executive-ai-insights.critical",

        tenantId:
          current.tenantId,

        workspaceId:
          current.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          briefingId:
            current.id,

          executiveScore:
            current.executiveScore,

          executiveStatus:
            current.summary
              .executiveStatus,

          criticalInsights:
            current.insights
              .filter(
                (insight) =>
                  insight.severity
                  === "critical",
              )
              .map(
                (insight) => ({
                  id: insight.id,
                  category:
                    insight.category,
                  title:
                    insight.title,
                  recommendedAction:
                    insight.recommendedAction,
                }),
              ),

          primaryDecision:
            current.summary
              .primaryDecision,
        },
      });
    }
  }

  private isMaterialChange(
    previous:
      ExecutiveAIInsightBriefing | null,
    current:
      ExecutiveAIInsightBriefing,
  ): boolean {
    if (!previous) {
      return true;
    }

    if (
      Math.abs(
        current.executiveScore
        - previous.executiveScore,
      ) >= 10
    ) {
      return true;
    }

    if (
      current.summary.executiveStatus
      !== previous.summary
        .executiveStatus
    ) {
      return true;
    }

    if (
      current.criticalInsightCount
      !== previous.criticalInsightCount
    ) {
      return true;
    }

    if (
      current.managementAttentionRequired
      !== previous.managementAttentionRequired
    ) {
      return true;
    }

    return false;
  }

  private resolveCacheTtlMs(
    briefing:
      ExecutiveAIInsightBriefing,
  ): number {
    const expiresAt =
      new Date(
        briefing.expiresAt,
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
        .briefingTtlHours
      * 60
      * 60
      * 1000
    );
  }

  private createCacheKey(
    query:
      ExecutiveAIInsightQuery,
  ): string {
    return [
      "ai-revenue-intelligence",
      "executive-ai-insights",
      query.tenantId,
      query.workspaceId
        ?? "default",
      query.periodStart,
      query.periodEnd,
    ].join(":");
  }

  private async writeAudit(
    record:
      ExecutiveAIInsightAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(
      record,
    );
  }
}

export const createExecutiveAIInsightRuntime = (
  dependencies:
    ExecutiveAIInsightRuntimeDependencies,
): ExecutiveAIInsightRuntime =>
  new ExecutiveAIInsightRuntime(
    dependencies,
  );
