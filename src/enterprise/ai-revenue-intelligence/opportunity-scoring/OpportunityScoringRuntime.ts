import {
  OpportunityScore,
  OpportunityScoreChange,
  OpportunityScoreHistoryEntry,
  OpportunityScoringAuditRecord,
  OpportunityScoringClock,
  OpportunityScoringConfiguration,
  OpportunityScoringEvent,
  OpportunityScoringIdGenerator,
  OpportunityScoringRequest,
} from "./OpportunityScoringTypes";
import {
  OpportunityScoringEngine,
} from "./OpportunityScoringEngine";
import {
  OpportunityScoringRepository,
  assertOpportunityScoringRepository,
} from "./OpportunityScoringRepository";

export interface OpportunityScoringEventPublisher {
  publish(event: OpportunityScoringEvent): Promise<void>;
}

export interface OpportunityScoringAuditWriter {
  write(record: OpportunityScoringAuditRecord): Promise<void>;
}

export interface OpportunityScoringCache {
  get(key: string): Promise<OpportunityScore | null>;
  set(
    key: string,
    score: OpportunityScore,
    ttlMs: number,
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

export interface OpportunityScoringRuntimeDependencies {
  engine: OpportunityScoringEngine;
  repository: OpportunityScoringRepository;
  cache?: OpportunityScoringCache;
  eventPublisher?: OpportunityScoringEventPublisher;
  auditWriter?: OpportunityScoringAuditWriter;
  clock?: OpportunityScoringClock;
  idGenerator?: OpportunityScoringIdGenerator;
  configuration?: Partial<OpportunityScoringConfiguration>;
}

const DEFAULT_CONFIGURATION: OpportunityScoringConfiguration = {
  scoringVersion: "5.0.0",
  materialChangeThreshold: 5,
  cacheTtlMs: 5 * 60 * 1000,
  minimumConfidence: 25,
};

const systemClock: OpportunityScoringClock = {
  now: () => new Date(),
};

const systemIdGenerator: OpportunityScoringIdGenerator = {
  next: () => globalThis.crypto.randomUUID(),
};

export class OpportunityScoringRuntime {
  private readonly engine: OpportunityScoringEngine;
  private readonly repository: OpportunityScoringRepository;
  private readonly cache?: OpportunityScoringCache;
  private readonly eventPublisher?: OpportunityScoringEventPublisher;
  private readonly auditWriter?: OpportunityScoringAuditWriter;
  private readonly clock: OpportunityScoringClock;
  private readonly idGenerator: OpportunityScoringIdGenerator;
  private readonly configuration: OpportunityScoringConfiguration;

  constructor(
    dependencies: OpportunityScoringRuntimeDependencies,
  ) {
    this.engine = dependencies.engine;
    this.repository = assertOpportunityScoringRepository(
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
  ): Promise<OpportunityScore | null> {
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
          scoringVersion: cached.scoringVersion,
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

    const score = await this.repository.findLatest({
      tenantId,
      workspaceId,
      opportunityId,
    });

    if (score && this.cache) {
      await this.cache.set(
        cacheKey,
        score,
        this.configuration.cacheTtlMs,
      );
    }

    return score;
  }

  async calculate(
    request: OpportunityScoringRequest,
  ): Promise<OpportunityScore> {
    const { context } = request;
    const previousScore = await this.repository.findLatest({
      tenantId: context.tenantId,
      workspaceId: context.workspaceId,
      opportunityId: context.opportunityId,
    });

    try {
      const calculated = this.engine.calculate(
        context,
        this.clock.now(),
      );

      const persisted = await this.repository.save({
        ...calculated,
        id: calculated.id ?? this.idGenerator.next(),
      });

      const historyEntry: OpportunityScoreHistoryEntry = {
        id: this.idGenerator.next(),
        tenantId: persisted.tenantId,
        workspaceId: persisted.workspaceId,
        opportunityId: persisted.opportunityId,
        score: persisted.score,
        confidence: persisted.confidence,
        riskLevel: persisted.riskLevel,
        scoringVersion: persisted.scoringVersion,
        reason: request.reason,
        calculatedAt: persisted.calculatedAt,
      };

      await this.repository.appendHistory(historyEntry);

      const cacheKey = this.createCacheKey(
        persisted.tenantId,
        persisted.opportunityId,
        persisted.workspaceId,
      );

      if (this.cache) {
        await this.cache.set(
          cacheKey,
          persisted,
          this.configuration.cacheTtlMs,
        );
      }

      const change = this.calculateChange(
        previousScore,
        persisted,
      );

      await this.publishScoreEvents(
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
          score: persisted.score,
          confidence: persisted.confidence,
          riskLevel: persisted.riskLevel,
          delta: change.delta,
          materiallyChanged: change.materiallyChanged,
        },
      });

      return persisted;
    } catch (error) {
      await this.writeAudit({
        tenantId: context.tenantId,
        workspaceId: context.workspaceId,
        opportunityId: context.opportunityId,
        action: "failure",
        actorId: request.requestedBy,
        correlationId: request.correlationId,
        occurredAt: this.clock.now().toISOString(),
        details: {
          message:
            error instanceof Error
              ? error.message
              : "Unknown opportunity scoring failure.",
        },
      });

      await this.eventPublisher?.publish({
        eventId: this.idGenerator.next(),
        eventType: "opportunity.scoring.failed",
        tenantId: context.tenantId,
        workspaceId: context.workspaceId,
        opportunityId: context.opportunityId,
        occurredAt: this.clock.now().toISOString(),
        correlationId: request.correlationId,
        payload: {
          message:
            error instanceof Error
              ? error.message
              : "Unknown opportunity scoring failure.",
        },
      });

      throw error;
    }
  }

  async recalculate(
    request: OpportunityScoringRequest,
  ): Promise<OpportunityScore> {
    const cacheKey = this.createCacheKey(
      request.context.tenantId,
      request.context.opportunityId,
      request.context.workspaceId,
    );

    await this.cache?.delete(cacheKey);

    return this.calculate({
      ...request,
      forceRefresh: true,
    });
  }

  private calculateChange(
    previous: OpportunityScore | null,
    current: OpportunityScore,
  ): OpportunityScoreChange {
    const previousScore = previous?.score;
    const delta =
      previousScore === undefined
        ? 0
        : current.score - previousScore;

    return {
      previousScore,
      currentScore: current.score,
      delta,
      previousRiskLevel: previous?.riskLevel,
      currentRiskLevel: current.riskLevel,
      materiallyChanged:
        previous === null
        || Math.abs(delta)
          >= this.configuration.materialChangeThreshold
        || previous.riskLevel !== current.riskLevel,
    };
  }

  private async publishScoreEvents(
    score: OpportunityScore,
    change: OpportunityScoreChange,
    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId: this.idGenerator.next(),
      eventType: "opportunity.scoring.calculated",
      tenantId: score.tenantId,
      workspaceId: score.workspaceId,
      opportunityId: score.opportunityId,
      occurredAt: this.clock.now().toISOString(),
      correlationId,
      payload: {
        score: score.score,
        confidence: score.confidence,
        riskLevel: score.riskLevel,
        scoringVersion: score.scoringVersion,
      },
    });

    if (change.materiallyChanged) {
      await this.eventPublisher.publish({
        eventId: this.idGenerator.next(),
        eventType: "opportunity.scoring.changed",
        tenantId: score.tenantId,
        workspaceId: score.workspaceId,
        opportunityId: score.opportunityId,
        occurredAt: this.clock.now().toISOString(),
        correlationId,
        payload: {
          previousScore: change.previousScore,
          currentScore: change.currentScore,
          delta: change.delta,
          previousRiskLevel: change.previousRiskLevel,
          currentRiskLevel: change.currentRiskLevel,
        },
      });
    }
  }

  private async writeAudit(
    record: OpportunityScoringAuditRecord,
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
      "opportunity-scoring",
      tenantId,
      workspaceId ?? "default",
      opportunityId,
    ].join(":");
  }
}

