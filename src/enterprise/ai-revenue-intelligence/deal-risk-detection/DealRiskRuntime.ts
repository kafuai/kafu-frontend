import type {
  DealRiskAssessment,
  DealRiskAuditRecord,
  DealRiskChange,
  DealRiskClock,
  DealRiskConfiguration,
  DealRiskEvent,
  DealRiskHistoryEntry,
  DealRiskIdGenerator,
  DealRiskRequest,
} from "./DealRiskTypes";
import {
  DealRiskEngine,
} from "./DealRiskEngine";
import {
  assertDealRiskRepository,
  type DealRiskRepository,
} from "./DealRiskRepository";

export interface DealRiskEventPublisher {
  publish(
    event: DealRiskEvent,
  ): Promise<void>;
}

export interface DealRiskAuditWriter {
  write(
    record: DealRiskAuditRecord,
  ): Promise<void>;
}

export interface DealRiskCache {
  get(
    key: string,
  ): Promise<DealRiskAssessment | null>;

  set(
    key: string,
    assessment: DealRiskAssessment,
    ttlMs: number,
  ): Promise<void>;

  delete(key: string): Promise<void>;
}

export interface DealRiskRuntimeDependencies {
  engine: DealRiskEngine;
  repository: DealRiskRepository;

  cache?: DealRiskCache;
  eventPublisher?: DealRiskEventPublisher;
  auditWriter?: DealRiskAuditWriter;

  clock?: DealRiskClock;
  idGenerator?: DealRiskIdGenerator;

  configuration?: Partial<
    DealRiskConfiguration
  >;
}

const DEFAULT_CONFIGURATION:
  DealRiskConfiguration = {
    modelVersion: "5.0.0",
    cacheTtlMs: 5 * 60 * 1000,
    minimumConfidence: 25,
    materialChangeThreshold: 5,
    immediateAttentionThreshold: 80,
  };

const systemClock: DealRiskClock = {
  now: () => new Date(),
};

const systemIdGenerator:
  DealRiskIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class DealRiskRuntime {
  private readonly engine:
    DealRiskEngine;

  private readonly repository:
    DealRiskRepository;

  private readonly cache?:
    DealRiskCache;

  private readonly eventPublisher?:
    DealRiskEventPublisher;

  private readonly auditWriter?:
    DealRiskAuditWriter;

  private readonly clock:
    DealRiskClock;

  private readonly idGenerator:
    DealRiskIdGenerator;

  private readonly configuration:
    DealRiskConfiguration;

  constructor(
    dependencies:
      DealRiskRuntimeDependencies,
  ) {
    this.engine =
      dependencies.engine;

    this.repository =
      assertDealRiskRepository(
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
    tenantId: string,
    opportunityId: string,
    workspaceId?: string,
  ): Promise<DealRiskAssessment | null> {
    const cacheKey =
      this.createCacheKey(
        tenantId,
        opportunityId,
        workspaceId,
      );

    const cached =
      await this.cache?.get(cacheKey);

    if (cached) {
      await this.writeAudit({
        tenantId,
        workspaceId,
        opportunityId,
        action: "cache-hit",
        occurredAt:
          this.clock.now().toISOString(),
        details: {
          modelVersion:
            cached.modelVersion,
        },
      });

      return cached;
    }

    await this.writeAudit({
      tenantId,
      workspaceId,
      opportunityId,
      action: "cache-miss",
      occurredAt:
        this.clock.now().toISOString(),
      details: {},
    });

    const assessment =
      await this.repository.findLatest({
        tenantId,
        workspaceId,
        opportunityId,
      });

    if (
      assessment
      && this.cache
    ) {
      await this.cache.set(
        cacheKey,
        assessment,
        this.configuration.cacheTtlMs,
      );
    }

    return assessment;
  }

  async calculate(
    request: DealRiskRequest,
  ): Promise<DealRiskAssessment> {
    const { context } = request;

    const previous =
      await this.repository.findLatest({
        tenantId:
          context.tenantId,
        workspaceId:
          context.workspaceId,
        opportunityId:
          context.opportunityId,
      });

    try {
      const calculated =
        this.engine.calculate(
          {
            ...context,

            previousRiskScore:
              context.previousRiskScore
              ?? previous?.riskScore,

            previousRiskLevel:
              context.previousRiskLevel
              ?? previous?.riskLevel,
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

      const historyEntry:
        DealRiskHistoryEntry = {
          id:
            this.idGenerator.next(),

          tenantId:
            persisted.tenantId,

          workspaceId:
            persisted.workspaceId,

          opportunityId:
            persisted.opportunityId,

          riskScore:
            persisted.riskScore,

          riskLevel:
            persisted.riskLevel,

          confidence:
            persisted.confidence,

          trend:
            persisted.trend,

          activeRiskCount:
            persisted.activeRiskCount,

          criticalRiskCount:
            persisted.criticalRiskCount,

          modelVersion:
            persisted.modelVersion,

          reason:
            request.reason,

          calculatedAt:
            persisted.calculatedAt,
        };

      await this.repository.appendHistory(
        historyEntry,
      );

      if (this.cache) {
        await this.cache.set(
          this.createCacheKey(
            persisted.tenantId,
            persisted.opportunityId,
            persisted.workspaceId,
          ),

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

        opportunityId:
          persisted.opportunityId,

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
          riskScore:
            persisted.riskScore,

          riskLevel:
            persisted.riskLevel,

          confidence:
            persisted.confidence,

          activeRiskCount:
            persisted.activeRiskCount,

          criticalRiskCount:
            persisted.criticalRiskCount,

          immediateAttentionRequired:
            persisted
              .immediateAttentionRequired,

          delta:
            change.delta,

          materiallyChanged:
            change.materiallyChanged,
        },
      });

      if (
        persisted.immediateAttentionRequired
      ) {
        await this.writeAudit({
          tenantId:
            persisted.tenantId,

          workspaceId:
            persisted.workspaceId,

          opportunityId:
            persisted.opportunityId,

          action:
            "critical-detected",

          actorId:
            request.requestedBy,

          correlationId:
            request.correlationId,

          occurredAt:
            this.clock.now().toISOString(),

          details: {
            riskScore:
              persisted.riskScore,

            riskLevel:
              persisted.riskLevel,

            topRisks:
              persisted.breakdown.topRisks
                .map(
                  (risk) => risk.key,
                ),
          },
        });
      }

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown deal-risk failure.";

      await this.writeAudit({
        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        opportunityId:
          context.opportunityId,

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
          "deal-risk.failed",

        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        opportunityId:
          context.opportunityId,

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
    request: DealRiskRequest,
  ): Promise<DealRiskAssessment> {
    await this.cache?.delete(
      this.createCacheKey(
        request.context.tenantId,
        request.context.opportunityId,
        request.context.workspaceId,
      ),
    );

    return this.calculate({
      ...request,
      forceRefresh: true,
    });
  }

  private calculateChange(
    previous: DealRiskAssessment | null,
    current: DealRiskAssessment,
  ): DealRiskChange {
    const previousRiskScore =
      previous?.riskScore;

    const delta =
      previousRiskScore === undefined
        ? 0
        : current.riskScore
          - previousRiskScore;

    return {
      previousRiskScore,

      currentRiskScore:
        current.riskScore,

      delta,

      previousRiskLevel:
        previous?.riskLevel,

      currentRiskLevel:
        current.riskLevel,

      materiallyChanged:
        previous === null
        || Math.abs(delta)
          >= this.configuration
            .materialChangeThreshold
        || previous.riskLevel
          !== current.riskLevel
        || previous
          .immediateAttentionRequired
          !== current
            .immediateAttentionRequired,
    };
  }

  private async publishEvents(
    assessment: DealRiskAssessment,
    change: DealRiskChange,
    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId:
        this.idGenerator.next(),

      eventType:
        "deal-risk.calculated",

      tenantId:
        assessment.tenantId,

      workspaceId:
        assessment.workspaceId,

      opportunityId:
        assessment.opportunityId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId,

      payload: {
        riskScore:
          assessment.riskScore,

        riskLevel:
          assessment.riskLevel,

        confidence:
          assessment.confidence,

        trend:
          assessment.trend,

        activeRiskCount:
          assessment.activeRiskCount,

        criticalRiskCount:
          assessment.criticalRiskCount,

        immediateAttentionRequired:
          assessment
            .immediateAttentionRequired,

        modelVersion:
          assessment.modelVersion,
      },
    });

    if (change.materiallyChanged) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "deal-risk.changed",

        tenantId:
          assessment.tenantId,

        workspaceId:
          assessment.workspaceId,

        opportunityId:
          assessment.opportunityId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          previousRiskScore:
            change.previousRiskScore,

          currentRiskScore:
            change.currentRiskScore,

          delta:
            change.delta,

          previousRiskLevel:
            change.previousRiskLevel,

          currentRiskLevel:
            change.currentRiskLevel,
        },
      });
    }

    if (
      assessment.immediateAttentionRequired
    ) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "deal-risk.critical",

        tenantId:
          assessment.tenantId,

        workspaceId:
          assessment.workspaceId,

        opportunityId:
          assessment.opportunityId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          riskScore:
            assessment.riskScore,

          riskLevel:
            assessment.riskLevel,

          criticalRiskCount:
            assessment.criticalRiskCount,

          topRisks:
            assessment.breakdown.topRisks
              .map((risk) => ({
                key: risk.key,
                category: risk.category,
                riskScore: risk.riskScore,
                reason: risk.reason,
              })),
        },
      });
    }
  }

  private async writeAudit(
    record: DealRiskAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(record);
  }

  private createCacheKey(
    tenantId: string,
    opportunityId: string,
    workspaceId?: string,
  ): string {
    return [
      "ai-revenue-intelligence",
      "deal-risk-detection",
      tenantId,
      workspaceId ?? "default",
      opportunityId,
    ].join(":");
  }
}
