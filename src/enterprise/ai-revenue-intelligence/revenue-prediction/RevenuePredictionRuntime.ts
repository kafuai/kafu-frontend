import type {
  RevenuePrediction,
  RevenuePredictionAuditRecord,
  RevenuePredictionChange,
  RevenuePredictionClock,
  RevenuePredictionConfiguration,
  RevenuePredictionEvent,
  RevenuePredictionHistoryEntry,
  RevenuePredictionIdGenerator,
  RevenuePredictionRequest,
} from "./RevenuePredictionTypes";
import {
  RevenuePredictionEngine,
} from "./RevenuePredictionEngine";
import {
  assertRevenuePredictionRepository,
  type RevenuePredictionRepository,
} from "./RevenuePredictionRepository";

export interface RevenuePredictionEventPublisher {
  publish(
    event: RevenuePredictionEvent,
  ): Promise<void>;
}

export interface RevenuePredictionAuditWriter {
  write(
    record: RevenuePredictionAuditRecord,
  ): Promise<void>;
}

export interface RevenuePredictionCache {
  get(
    key: string,
  ): Promise<RevenuePrediction | null>;

  set(
    key: string,
    prediction: RevenuePrediction,
    ttlMs: number,
  ): Promise<void>;

  delete(key: string): Promise<void>;
}

export interface RevenuePredictionRuntimeDependencies {
  engine: RevenuePredictionEngine;
  repository: RevenuePredictionRepository;

  cache?: RevenuePredictionCache;
  eventPublisher?: RevenuePredictionEventPublisher;
  auditWriter?: RevenuePredictionAuditWriter;

  clock?: RevenuePredictionClock;
  idGenerator?: RevenuePredictionIdGenerator;

  configuration?: Partial<
    RevenuePredictionConfiguration
  >;
}

const DEFAULT_CONFIGURATION:
  RevenuePredictionConfiguration = {
    modelVersion: "5.0.0",
    materialChangeThresholdPercent: 5,
    cacheTtlMs: 5 * 60 * 1000,
    minimumConfidence: 25,
    defaultHorizon: "current-quarter",
    minimumAdjustmentMultiplier: 0.75,
    maximumAdjustmentMultiplier: 1.2,
  };

const systemClock: RevenuePredictionClock = {
  now: () => new Date(),
};

const systemIdGenerator:
  RevenuePredictionIdGenerator = {
    next: () => globalThis.crypto.randomUUID(),
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
    this.engine = dependencies.engine;

    this.repository =
      assertRevenuePredictionRepository(
        dependencies.repository,
      );

    this.cache = dependencies.cache;
    this.eventPublisher =
      dependencies.eventPublisher;
    this.auditWriter =
      dependencies.auditWriter;

    this.clock =
      dependencies.clock ?? systemClock;

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
  ): Promise<RevenuePrediction | null> {
    const cacheKey = this.createCacheKey(
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
          modelVersion: cached.modelVersion,
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

    const prediction =
      await this.repository.findLatest({
        tenantId,
        workspaceId,
        opportunityId,
      });

    if (prediction && this.cache) {
      await this.cache.set(
        cacheKey,
        prediction,
        this.configuration.cacheTtlMs,
      );
    }

    return prediction;
  }

  async calculate(
    request: RevenuePredictionRequest,
  ): Promise<RevenuePrediction> {
    const { context } = request;

    const previous =
      await this.repository.findLatest({
        tenantId: context.tenantId,
        workspaceId: context.workspaceId,
        opportunityId:
          context.opportunityId,
      });

    try {
      const calculated =
        this.engine.calculate(
          {
            ...context,
            previousPredictedRevenue:
              context.previousPredictedRevenue
              ?? previous?.predictedRevenue,
          },
          request.horizon
            ?? this.configuration
              .defaultHorizon,
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
        RevenuePredictionHistoryEntry = {
          id: this.idGenerator.next(),

          tenantId: persisted.tenantId,
          workspaceId:
            persisted.workspaceId,
          opportunityId:
            persisted.opportunityId,

          currency: persisted.currency,
          dealValue: persisted.dealValue,
          predictedRevenue:
            persisted.predictedRevenue,
          confidence:
            persisted.confidence,
          riskLevel:
            persisted.riskLevel,
          horizon: persisted.horizon,

          modelVersion:
            persisted.modelVersion,
          reason: request.reason,
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
        tenantId: persisted.tenantId,
        workspaceId:
          persisted.workspaceId,
        opportunityId:
          persisted.opportunityId,
        action: request.forceRefresh
          ? "refresh"
          : "calculate",
        actorId: request.requestedBy,
        correlationId:
          request.correlationId,
        occurredAt:
          this.clock.now().toISOString(),
        details: {
          currency: persisted.currency,
          dealValue:
            persisted.dealValue,
          predictedRevenue:
            persisted.predictedRevenue,
          confidence:
            persisted.confidence,
          riskLevel:
            persisted.riskLevel,
          delta: change.delta,
          deltaPercent:
            change.deltaPercent,
          materiallyChanged:
            change.materiallyChanged,
        },
      });

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown revenue-prediction failure.";

      await this.writeAudit({
        tenantId: context.tenantId,
        workspaceId:
          context.workspaceId,
        opportunityId:
          context.opportunityId,
        action: "failure",
        actorId: request.requestedBy,
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
          "revenue-prediction.failed",
        tenantId: context.tenantId,
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
    request: RevenuePredictionRequest,
  ): Promise<RevenuePrediction> {
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
    previous: RevenuePrediction | null,
    current: RevenuePrediction,
  ): RevenuePredictionChange {
    const previousPredictedRevenue =
      previous?.predictedRevenue;

    const delta =
      previousPredictedRevenue === undefined
        ? 0
        : current.predictedRevenue
          - previousPredictedRevenue;

    const deltaPercent =
      previousPredictedRevenue
        && previousPredictedRevenue !== 0
        ? (delta
            / previousPredictedRevenue)
          * 100
        : undefined;

    return {
      previousPredictedRevenue,
      currentPredictedRevenue:
        current.predictedRevenue,
      delta,
      deltaPercent,
      materiallyChanged:
        previous === null
        || (
          deltaPercent !== undefined
          && Math.abs(deltaPercent)
            >= this.configuration
              .materialChangeThresholdPercent
        )
        || previous.riskLevel
          !== current.riskLevel,
    };
  }

  private async publishEvents(
    prediction: RevenuePrediction,
    change: RevenuePredictionChange,
    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId:
        this.idGenerator.next(),
      eventType:
        "revenue-prediction.calculated",
      tenantId: prediction.tenantId,
      workspaceId:
        prediction.workspaceId,
      opportunityId:
        prediction.opportunityId,
      occurredAt:
        this.clock.now().toISOString(),
      correlationId,
      payload: {
        currency:
          prediction.currency,
        dealValue:
          prediction.dealValue,
        predictedRevenue:
          prediction.predictedRevenue,
        confidence:
          prediction.confidence,
        riskLevel:
          prediction.riskLevel,
        horizon:
          prediction.horizon,
        modelVersion:
          prediction.modelVersion,
      },
    });

    if (change.materiallyChanged) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),
        eventType:
          "revenue-prediction.changed",
        tenantId:
          prediction.tenantId,
        workspaceId:
          prediction.workspaceId,
        opportunityId:
          prediction.opportunityId,
        occurredAt:
          this.clock.now().toISOString(),
        correlationId,
        payload: {
          previousPredictedRevenue:
            change.previousPredictedRevenue,
          currentPredictedRevenue:
            change.currentPredictedRevenue,
          delta: change.delta,
          deltaPercent:
            change.deltaPercent,
        },
      });
    }
  }

  private async writeAudit(
    record: RevenuePredictionAuditRecord,
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
      "revenue-prediction",
      tenantId,
      workspaceId ?? "default",
      opportunityId,
    ].join(":");
  }
}
