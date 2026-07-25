import type {
  PipelineHealthAssessment,
  PipelineHealthAuditRecord,
  PipelineHealthChange,
  PipelineHealthClock,
  PipelineHealthConfiguration,
  PipelineHealthEvent,
  PipelineHealthHistoryEntry,
  PipelineHealthIdGenerator,
  PipelineHealthRequest,
} from "./PipelineHealthTypes";
import {
  PipelineHealthEngine,
} from "./PipelineHealthEngine";
import {
  assertPipelineHealthRepository,
  type PipelineHealthRepository,
} from "./PipelineHealthRepository";

export interface PipelineHealthEventPublisher {
  publish(
    event: PipelineHealthEvent,
  ): Promise<void>;
}

export interface PipelineHealthAuditWriter {
  write(
    record: PipelineHealthAuditRecord,
  ): Promise<void>;
}

export interface PipelineHealthCache {
  get(
    key: string,
  ): Promise<
    PipelineHealthAssessment | null
  >;

  set(
    key: string,
    assessment:
      PipelineHealthAssessment,
    ttlMs: number,
  ): Promise<void>;

  delete(key: string): Promise<void>;
}

export interface PipelineHealthRuntimeDependencies {
  engine: PipelineHealthEngine;
  repository: PipelineHealthRepository;

  cache?: PipelineHealthCache;
  eventPublisher?:
    PipelineHealthEventPublisher;
  auditWriter?:
    PipelineHealthAuditWriter;

  clock?: PipelineHealthClock;
  idGenerator?:
    PipelineHealthIdGenerator;

  configuration?: Partial<
    PipelineHealthConfiguration
  >;
}

const DEFAULT_CONFIGURATION:
  PipelineHealthConfiguration = {
    modelVersion: "5.0.0",
    cacheTtlMs: 5 * 60 * 1000,
    minimumConfidence: 25,
    materialChangeThreshold: 5,
  };

const systemClock:
  PipelineHealthClock = {
    now: () => new Date(),
  };

const systemIdGenerator:
  PipelineHealthIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class PipelineHealthRuntime {
  private readonly engine:
    PipelineHealthEngine;

  private readonly repository:
    PipelineHealthRepository;

  private readonly cache?:
    PipelineHealthCache;

  private readonly eventPublisher?:
    PipelineHealthEventPublisher;

  private readonly auditWriter?:
    PipelineHealthAuditWriter;

  private readonly clock:
    PipelineHealthClock;

  private readonly idGenerator:
    PipelineHealthIdGenerator;

  private readonly configuration:
    PipelineHealthConfiguration;

  constructor(
    dependencies:
      PipelineHealthRuntimeDependencies,
  ) {
    this.engine =
      dependencies.engine;

    this.repository =
      assertPipelineHealthRepository(
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
    pipelineId?: string,
    workspaceId?: string,
  ): Promise<
    PipelineHealthAssessment | null
  > {
    const cacheKey =
      this.createCacheKey(
        tenantId,
        pipelineId,
        workspaceId,
      );

    const cached =
      await this.cache?.get(cacheKey);

    if (cached) {
      await this.writeAudit({
        tenantId,
        workspaceId,
        pipelineId,
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
      pipelineId,
      action: "cache-miss",
      occurredAt:
        this.clock.now().toISOString(),
      details: {},
    });

    const assessment =
      await this.repository.findLatest({
        tenantId,
        workspaceId,
        pipelineId,
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
    request: PipelineHealthRequest,
  ): Promise<PipelineHealthAssessment> {
    const { context } = request;

    const previous =
      await this.repository.findLatest({
        tenantId: context.tenantId,
        workspaceId:
          context.workspaceId,
        pipelineId:
          context.pipelineId,
      });

    try {
      const calculated =
        this.engine.calculate(
          {
            ...context,
            previousHealthScore:
              context.previousHealthScore
              ?? previous?.healthScore,
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
        PipelineHealthHistoryEntry = {
          id:
            this.idGenerator.next(),

          tenantId:
            persisted.tenantId,

          workspaceId:
            persisted.workspaceId,

          pipelineId:
            persisted.pipelineId,

          healthScore:
            persisted.healthScore,

          healthLevel:
            persisted.healthLevel,

          confidence:
            persisted.confidence,

          trend:
            persisted.trend,

          totalPipelineValue:
            persisted.totalPipelineValue,

          predictedRevenue:
            persisted.predictedRevenue,

          opportunityCount:
            persisted.opportunityCount,

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
            persisted.pipelineId,
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

        pipelineId:
          persisted.pipelineId,

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
          healthScore:
            persisted.healthScore,

          healthLevel:
            persisted.healthLevel,

          confidence:
            persisted.confidence,

          opportunityCount:
            persisted.opportunityCount,

          predictedRevenue:
            persisted.predictedRevenue,

          delta:
            change.delta,

          materiallyChanged:
            change.materiallyChanged,
        },
      });

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown pipeline-health failure.";

      await this.writeAudit({
        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        pipelineId:
          context.pipelineId,

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
          "pipeline-health.failed",

        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        pipelineId:
          context.pipelineId,

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
    request: PipelineHealthRequest,
  ): Promise<PipelineHealthAssessment> {
    await this.cache?.delete(
      this.createCacheKey(
        request.context.tenantId,
        request.context.pipelineId,
        request.context.workspaceId,
      ),
    );

    return this.calculate({
      ...request,
      forceRefresh: true,
    });
  }

  private calculateChange(
    previous:
      PipelineHealthAssessment | null,

    current:
      PipelineHealthAssessment,
  ): PipelineHealthChange {
    const previousHealthScore =
      previous?.healthScore;

    const delta =
      previousHealthScore === undefined
        ? 0
        : current.healthScore
          - previousHealthScore;

    return {
      previousHealthScore,
      currentHealthScore:
        current.healthScore,
      delta,
      previousLevel:
        previous?.healthLevel,
      currentLevel:
        current.healthLevel,
      materiallyChanged:
        previous === null
        || Math.abs(delta)
          >= this.configuration
            .materialChangeThreshold
        || previous.healthLevel
          !== current.healthLevel,
    };
  }

  private async publishEvents(
    assessment:
      PipelineHealthAssessment,

    change:
      PipelineHealthChange,

    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId:
        this.idGenerator.next(),

      eventType:
        "pipeline-health.calculated",

      tenantId:
        assessment.tenantId,

      workspaceId:
        assessment.workspaceId,

      pipelineId:
        assessment.pipelineId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId,

      payload: {
        healthScore:
          assessment.healthScore,

        healthLevel:
          assessment.healthLevel,

        confidence:
          assessment.confidence,

        trend:
          assessment.trend,

        opportunityCount:
          assessment.opportunityCount,

        totalPipelineValue:
          assessment.totalPipelineValue,

        predictedRevenue:
          assessment.predictedRevenue,

        modelVersion:
          assessment.modelVersion,
      },
    });

    if (change.materiallyChanged) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "pipeline-health.changed",

        tenantId:
          assessment.tenantId,

        workspaceId:
          assessment.workspaceId,

        pipelineId:
          assessment.pipelineId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          previousHealthScore:
            change.previousHealthScore,

          currentHealthScore:
            change.currentHealthScore,

          delta:
            change.delta,

          previousLevel:
            change.previousLevel,

          currentLevel:
            change.currentLevel,
        },
      });
    }
  }

  private async writeAudit(
    record:
      PipelineHealthAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(
      record,
    );
  }

  private createCacheKey(
    tenantId: string,
    pipelineId?: string,
    workspaceId?: string,
  ): string {
    return [
      "ai-revenue-intelligence",
      "pipeline-health",
      tenantId,
      workspaceId ?? "default",
      pipelineId ?? "default",
    ].join(":");
  }
}
