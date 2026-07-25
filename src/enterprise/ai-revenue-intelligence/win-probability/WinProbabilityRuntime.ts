import type {
  WinProbabilityAuditRecord,
  WinProbabilityChange,
  WinProbabilityClock,
  WinProbabilityConfiguration,
  WinProbabilityEvent,
  WinProbabilityHistoryEntry,
  WinProbabilityIdGenerator,
  WinProbabilityPrediction,
  WinProbabilityRequest,
} from "./WinProbabilityTypes";
import {
  WinProbabilityEngine,
} from "./WinProbabilityEngine";
import {
  assertWinProbabilityRepository,
  WinProbabilityRepository,
} from "./WinProbabilityRepository";

export interface WinProbabilityEventPublisher {
  publish(event: WinProbabilityEvent): Promise<void>;
}

export interface WinProbabilityAuditWriter {
  write(record: WinProbabilityAuditRecord): Promise<void>;
}

export interface WinProbabilityCache {
  get(key: string): Promise<WinProbabilityPrediction | null>;
  set(
    key: string,
    prediction: WinProbabilityPrediction,
    ttlMs: number,
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface WinProbabilityRuntimeDependencies {
  engine: WinProbabilityEngine;
  repository: WinProbabilityRepository;
  cache?: WinProbabilityCache;
  eventPublisher?: WinProbabilityEventPublisher;
  auditWriter?: WinProbabilityAuditWriter;
  clock?: WinProbabilityClock;
  idGenerator?: WinProbabilityIdGenerator;
  configuration?: Partial<WinProbabilityConfiguration>;
}

const DEFAULT_CONFIGURATION: WinProbabilityConfiguration = {
  modelVersion: "5.0.0",
  materialChangeThreshold: 5,
  cacheTtlMs: 5 * 60 * 1000,
  minimumConfidence: 25,
  intercept: 0,
};

const systemClock: WinProbabilityClock = {
  now: () => new Date(),
};

const systemIdGenerator: WinProbabilityIdGenerator = {
  next: () => globalThis.crypto.randomUUID(),
};

export class WinProbabilityRuntime {
  private readonly engine: WinProbabilityEngine;
  private readonly repository: WinProbabilityRepository;
  private readonly cache?: WinProbabilityCache;
  private readonly eventPublisher?: WinProbabilityEventPublisher;
  private readonly auditWriter?: WinProbabilityAuditWriter;
  private readonly clock: WinProbabilityClock;
  private readonly idGenerator: WinProbabilityIdGenerator;
  private readonly configuration: WinProbabilityConfiguration;

  constructor(
    dependencies: WinProbabilityRuntimeDependencies,
  ) {
    this.engine = dependencies.engine;
    this.repository = assertWinProbabilityRepository(
      dependencies.repository,
    );
    this.cache = dependencies.cache;
    this.eventPublisher = dependencies.eventPublisher;
    this.auditWriter = dependencies.auditWriter;
    this.clock = dependencies.clock ?? systemClock;
    this.idGenerator =
      dependencies.idGenerator ?? systemIdGenerator;
    this.configuration = {
      ...DEFAULT_CONFIGURATION,
      ...dependencies.configuration,
    };
  }

  async getLatest(
    tenantId: string,
    opportunityId: string,
    workspaceId?: string,
  ): Promise<WinProbabilityPrediction | null> {
    const cacheKey = this.createCacheKey(
      tenantId,
      opportunityId,
      workspaceId,
    );

    const cached = await this.cache?.get(cacheKey);

    if (cached) {
      await this.writeAudit({
        tenantId,
        workspaceId,
        opportunityId,
        action: "cache-hit",
        occurredAt: this.clock.now().toISOString(),
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
      occurredAt: this.clock.now().toISOString(),
      details: {},
    });

    const prediction = await this.repository.findLatest({
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
    request: WinProbabilityRequest,
  ): Promise<WinProbabilityPrediction> {
    const { context } = request;

    const previous = await this.repository.findLatest({
      tenantId: context.tenantId,
      workspaceId: context.workspaceId,
      opportunityId: context.opportunityId,
    });

    try {
      const calculated = this.engine.calculate(
        {
          ...context,
          previousProbability:
            context.previousProbability
            ?? previous?.probability,
        },
        this.clock.now(),
      );

      const persisted = await this.repository.save({
        ...calculated,
        id: calculated.id ?? this.idGenerator.next(),
      });

      const historyEntry: WinProbabilityHistoryEntry = {
        id: this.idGenerator.next(),
        tenantId: persisted.tenantId,
        workspaceId: persisted.workspaceId,
        opportunityId: persisted.opportunityId,
        probability: persisted.probability,
        confidence: persisted.confidence,
        trend: persisted.trend,
        probabilityBand: persisted.probabilityBand,
        modelVersion: persisted.modelVersion,
        reason: request.reason,
        calculatedAt: persisted.calculatedAt,
      };

      await this.repository.appendHistory(historyEntry);

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

      const change = this.calculateChange(
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
        workspaceId: persisted.workspaceId,
        opportunityId: persisted.opportunityId,
        action: request.forceRefresh
          ? "refresh"
          : "calculate",
        actorId: request.requestedBy,
        correlationId: request.correlationId,
        occurredAt: this.clock.now().toISOString(),
        details: {
          probability: persisted.probability,
          confidence: persisted.confidence,
          trend: persisted.trend,
          delta: change.delta,
          materiallyChanged: change.materiallyChanged,
        },
      });

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown win-probability failure.";

      await this.writeAudit({
        tenantId: context.tenantId,
        workspaceId: context.workspaceId,
        opportunityId: context.opportunityId,
        action: "failure",
        actorId: request.requestedBy,
        correlationId: request.correlationId,
        occurredAt: this.clock.now().toISOString(),
        details: { message },
      });

      await this.eventPublisher?.publish({
        eventId: this.idGenerator.next(),
        eventType: "win-probability.failed",
        tenantId: context.tenantId,
        workspaceId: context.workspaceId,
        opportunityId: context.opportunityId,
        occurredAt: this.clock.now().toISOString(),
        correlationId: request.correlationId,
        payload: { message },
      });

      throw error;
    }
  }

  async recalculate(
    request: WinProbabilityRequest,
  ): Promise<WinProbabilityPrediction> {
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
    previous: WinProbabilityPrediction | null,
    current: WinProbabilityPrediction,
  ): WinProbabilityChange {
    const previousProbability = previous?.probability;
    const delta =
      previousProbability === undefined
        ? 0
        : current.probability - previousProbability;

    return {
      previousProbability,
      currentProbability: current.probability,
      delta,
      previousBand: previous?.probabilityBand,
      currentBand: current.probabilityBand,
      materiallyChanged:
        previous === null
        || Math.abs(delta)
          >= this.configuration.materialChangeThreshold
        || previous.probabilityBand
          !== current.probabilityBand,
    };
  }

  private async publishEvents(
    prediction: WinProbabilityPrediction,
    change: WinProbabilityChange,
    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId: this.idGenerator.next(),
      eventType: "win-probability.calculated",
      tenantId: prediction.tenantId,
      workspaceId: prediction.workspaceId,
      opportunityId: prediction.opportunityId,
      occurredAt: this.clock.now().toISOString(),
      correlationId,
      payload: {
        probability: prediction.probability,
        confidence: prediction.confidence,
        trend: prediction.trend,
        probabilityBand: prediction.probabilityBand,
        modelVersion: prediction.modelVersion,
      },
    });

    if (change.materiallyChanged) {
      await this.eventPublisher.publish({
        eventId: this.idGenerator.next(),
        eventType: "win-probability.changed",
        tenantId: prediction.tenantId,
        workspaceId: prediction.workspaceId,
        opportunityId: prediction.opportunityId,
        occurredAt: this.clock.now().toISOString(),
        correlationId,
        payload: {
          previousProbability:
            change.previousProbability,
          currentProbability:
            change.currentProbability,
          delta: change.delta,
          previousBand: change.previousBand,
          currentBand: change.currentBand,
        },
      });
    }
  }

  private async writeAudit(
    record: WinProbabilityAuditRecord,
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
      "win-probability",
      tenantId,
      workspaceId ?? "default",
      opportunityId,
    ].join(":");
  }
}
