import {
  SalesCoachingEngine,
} from "./SalesCoachingEngine";
import {
  assertSalesCoachingRepository,
} from "./SalesCoachingRepository";
import type {
  SalesCoachingRepository,
  SalesCoachingRecommendationStatusUpdate,
} from "./SalesCoachingRepository";
import type {
  SalesCoachingAuditRecord,
  SalesCoachingClock,
  SalesCoachingConfiguration,
  SalesCoachingEvent,
  SalesCoachingHistoryEntry,
  SalesCoachingIdGenerator,
  SalesCoachingPlan,
  SalesCoachingRecommendation,
  SalesCoachingRecommendationStatus,
  SalesCoachingRequest,
} from "./SalesCoachingTypes";

export interface SalesCoachingEventPublisher {
  publish(event: SalesCoachingEvent): Promise<void>;
}

export interface SalesCoachingAuditWriter {
  write(record: SalesCoachingAuditRecord): Promise<void>;
}

export interface SalesCoachingCache {
  get(key: string): Promise<SalesCoachingPlan | null>;

  set(
    key: string,
    plan: SalesCoachingPlan,
    ttlMs: number,
  ): Promise<void>;

  delete(key: string): Promise<void>;
}

export interface SalesCoachingRuntimeDependencies {
  engine: SalesCoachingEngine;
  repository: SalesCoachingRepository;

  cache?: SalesCoachingCache;
  eventPublisher?: SalesCoachingEventPublisher;
  auditWriter?: SalesCoachingAuditWriter;

  clock?: SalesCoachingClock;
  idGenerator?: SalesCoachingIdGenerator;

  configuration?:
    Partial<SalesCoachingConfiguration>;
}

const DEFAULT_CONFIGURATION:
  SalesCoachingConfiguration = {
    modelVersion: "5.0.0",
    maximumRecommendations: 7,
    recommendationTtlHours: 72,
    minimumRecommendationScore: 35,
    minimumConfidence: 25,
    criticalScoreThreshold: 85,
    highScoreThreshold: 70,
    mediumScoreThreshold: 50,
  };

const systemClock: SalesCoachingClock = {
  now: () => new Date(),
};

const systemIdGenerator:
  SalesCoachingIdGenerator = {
    next: () => globalThis.crypto.randomUUID(),
  };

const calculateMaterialChange = (
  previous: SalesCoachingPlan | null,
  current: SalesCoachingPlan,
): boolean => {
  if (!previous) {
    return true;
  }

  if (
    previous.criticalCount
    !== current.criticalCount
  ) {
    return true;
  }

  if (
    previous.highCount
    !== current.highCount
  ) {
    return true;
  }

  if (
    Math.abs(
      previous.planScore - current.planScore,
    ) >= 10
  ) {
    return true;
  }

  const previousKeys = new Set(
    previous.recommendations.map(
      (recommendation) =>
        recommendation.ruleKey,
    ),
  );

  const currentKeys = new Set(
    current.recommendations.map(
      (recommendation) =>
        recommendation.ruleKey,
    ),
  );

  if (
    previousKeys.size !== currentKeys.size
  ) {
    return true;
  }

  for (const key of currentKeys) {
    if (!previousKeys.has(key)) {
      return true;
    }
  }

  return false;
};

export class SalesCoachingRuntime {
  private readonly engine: SalesCoachingEngine;

  private readonly repository:
    SalesCoachingRepository;

  private readonly cache?: SalesCoachingCache;

  private readonly eventPublisher?:
    SalesCoachingEventPublisher;

  private readonly auditWriter?:
    SalesCoachingAuditWriter;

  private readonly clock: SalesCoachingClock;

  private readonly idGenerator:
    SalesCoachingIdGenerator;

  private readonly configuration:
    SalesCoachingConfiguration;

  constructor(
    dependencies:
      SalesCoachingRuntimeDependencies,
  ) {
    this.engine = dependencies.engine;

    this.repository =
      assertSalesCoachingRepository(
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
  ): Promise<SalesCoachingPlan | null> {
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
          planId: cached.id,
          modelVersion: cached.modelVersion,
          recommendationCount:
            cached.totalRecommendations,
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

    const plan =
      await this.repository.findLatest({
        tenantId,
        workspaceId,
        opportunityId,
      });

    if (plan && this.cache) {
      await this.cache.set(
        cacheKey,
        plan,
        this.resolveCacheTtlMs(plan),
      );
    }

    return plan;
  }

  async generate(
    request: SalesCoachingRequest,
  ): Promise<SalesCoachingPlan> {
    const { context } = request;

    const previous =
      await this.repository.findLatest({
        tenantId: context.tenantId,
        workspaceId: context.workspaceId,
        opportunityId:
          context.opportunityId,
      });

    try {
      const generated = this.engine.generate(
        {
          ...context,
          previousRecommendationKeys:
            context.previousRecommendationKeys
            ?? previous?.recommendations.map(
              (recommendation) =>
                recommendation.ruleKey,
            ),
        },
        this.clock.now(),
      );

      const planId =
        generated.id
        ?? this.idGenerator.next();

      const recommendations =
        generated.recommendations.map(
          (recommendation) => ({
            ...recommendation,
            id:
              recommendation.id
              ?? this.idGenerator.next(),
          }),
        );

      const persisted =
        await this.repository.savePlan({
          ...generated,
          id: planId,
          recommendations,
        });

      const historyEntry:
        SalesCoachingHistoryEntry = {
          id: this.idGenerator.next(),
          tenantId: persisted.tenantId,
          workspaceId:
            persisted.workspaceId,
          opportunityId:
            persisted.opportunityId,
          planId: persisted.id,
          recommendationCount:
            persisted.totalRecommendations,
          criticalCount:
            persisted.criticalCount,
          highCount: persisted.highCount,
          planScore: persisted.planScore,
          confidence:
            persisted.confidence,
          sourceProbability:
            persisted.sourceProbability,
          reason: request.reason,
          generatedAt:
            persisted.generatedAt,
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
          this.resolveCacheTtlMs(
            persisted,
          ),
        );
      }

      const materiallyChanged =
        calculateMaterialChange(
          previous,
          persisted,
        );

      await this.publishGeneratedEvents(
        persisted,
        previous,
        materiallyChanged,
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
          : "generate",
        actorId: request.requestedBy,
        correlationId:
          request.correlationId,
        occurredAt:
          this.clock.now().toISOString(),
        details: {
          planId: persisted.id,
          recommendationCount:
            persisted.totalRecommendations,
          criticalCount:
            persisted.criticalCount,
          highCount:
            persisted.highCount,
          planScore:
            persisted.planScore,
          confidence:
            persisted.confidence,
          materiallyChanged,
        },
      });

      return persisted;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown sales-coaching failure.";

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
          "sales-coaching.failed",
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

  async regenerate(
    request: SalesCoachingRequest,
  ): Promise<SalesCoachingPlan> {
    await this.cache?.delete(
      this.createCacheKey(
        request.context.tenantId,
        request.context.opportunityId,
        request.context.workspaceId,
      ),
    );

    return this.generate({
      ...request,
      forceRefresh: true,
      reason:
        request.reason
        ?? "manual-regeneration",
    });
  }

  async updateRecommendationStatus(
    input: {
      tenantId: string;
      workspaceId?: string;
      opportunityId: string;
      recommendationId: string;
      status:
        SalesCoachingRecommendationStatus;
      actorId?: string;
      reason?: string;
      correlationId?: string;
    },
  ): Promise<SalesCoachingRecommendation> {
    const recommendation =
      await this.repository
        .findRecommendation({
          tenantId: input.tenantId,
          workspaceId:
            input.workspaceId,
          opportunityId:
            input.opportunityId,
          recommendationId:
            input.recommendationId,
        });

    if (!recommendation) {
      throw new Error(
        "Sales coaching recommendation was not found.",
      );
    }

    this.validateStatusTransition(
      recommendation.status,
      input.status,
    );

    const occurredAt =
      this.clock.now().toISOString();

    const update:
      SalesCoachingRecommendationStatusUpdate = {
        tenantId: input.tenantId,
        workspaceId:
          input.workspaceId,
        opportunityId:
          input.opportunityId,
        recommendationId:
          input.recommendationId,
        status: input.status,
        actorId: input.actorId,
        reason: input.reason,
        occurredAt,
      };

    const updated =
      await this.repository
        .updateRecommendationStatus(
          update,
        );

    await this.cache?.delete(
      this.createCacheKey(
        input.tenantId,
        input.opportunityId,
        input.workspaceId,
      ),
    );

    await this.eventPublisher?.publish({
      eventId:
        this.idGenerator.next(),
      eventType:
        "sales-coaching.recommendation-status-changed",
      tenantId: input.tenantId,
      workspaceId:
        input.workspaceId,
      opportunityId:
        input.opportunityId,
      occurredAt,
      correlationId:
        input.correlationId,
      payload: {
        recommendationId:
          updated.id,
        ruleKey: updated.ruleKey,
        previousStatus:
          recommendation.status,
        currentStatus:
          updated.status,
        reason: input.reason,
      },
    });

    await this.writeAudit({
      tenantId: input.tenantId,
      workspaceId:
        input.workspaceId,
      opportunityId:
        input.opportunityId,
      action: "status-change",
      actorId: input.actorId,
      correlationId:
        input.correlationId,
      occurredAt,
      details: {
        recommendationId:
          input.recommendationId,
        ruleKey: updated.ruleKey,
        previousStatus:
          recommendation.status,
        currentStatus:
          updated.status,
        reason: input.reason,
      },
    });

    return updated;
  }

  private async publishGeneratedEvents(
    current: SalesCoachingPlan,
    previous: SalesCoachingPlan | null,
    materiallyChanged: boolean,
    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId:
        this.idGenerator.next(),
      eventType:
        "sales-coaching.generated",
      tenantId: current.tenantId,
      workspaceId:
        current.workspaceId,
      opportunityId:
        current.opportunityId,
      occurredAt:
        this.clock.now().toISOString(),
      correlationId,
      payload: {
        planId: current.id,
        recommendationCount:
          current.totalRecommendations,
        criticalCount:
          current.criticalCount,
        highCount:
          current.highCount,
        planScore:
          current.planScore,
        confidence:
          current.confidence,
        managementAttentionRequired:
          current.managementAttentionRequired,
        modelVersion:
          current.modelVersion,
      },
    });

    if (!materiallyChanged) {
      return;
    }

    await this.eventPublisher.publish({
      eventId:
        this.idGenerator.next(),
      eventType:
        "sales-coaching.material-change",
      tenantId: current.tenantId,
      workspaceId:
        current.workspaceId,
      opportunityId:
        current.opportunityId,
      occurredAt:
        this.clock.now().toISOString(),
      correlationId,
      payload: {
        previousPlanId:
          previous?.id,
        currentPlanId:
          current.id,
        previousCriticalCount:
          previous?.criticalCount,
        currentCriticalCount:
          current.criticalCount,
        previousHighCount:
          previous?.highCount,
        currentHighCount:
          current.highCount,
        previousPlanScore:
          previous?.planScore,
        currentPlanScore:
          current.planScore,
        currentRecommendationKeys:
          current.recommendations.map(
            (recommendation) =>
              recommendation.ruleKey,
          ),
      },
    });
  }

  private validateStatusTransition(
    current:
      SalesCoachingRecommendationStatus,
    next:
      SalesCoachingRecommendationStatus,
  ): void {
    if (current === next) {
      return;
    }

    const allowed:
      Record<
        SalesCoachingRecommendationStatus,
        readonly SalesCoachingRecommendationStatus[]
      > = {
        proposed: [
          "accepted",
          "dismissed",
          "expired",
        ],
        accepted: [
          "in-progress",
          "dismissed",
          "expired",
        ],
        "in-progress": [
          "completed",
          "dismissed",
          "expired",
        ],
        completed: [],
        dismissed: [],
        expired: [],
      };

    if (!allowed[current].includes(next)) {
      throw new Error(
        `Invalid sales coaching status transition from "${current}" to "${next}".`,
      );
    }
  }

  private resolveCacheTtlMs(
    plan: SalesCoachingPlan,
  ): number {
    const expiresAt =
      new Date(plan.expiresAt).getTime();

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
        .recommendationTtlHours
      * 60
      * 60
      * 1000
    );
  }

  private createCacheKey(
    tenantId: string,
    opportunityId: string,
    workspaceId?: string,
  ): string {
    return [
      "ai-revenue-intelligence",
      "sales-coaching",
      tenantId,
      workspaceId ?? "default",
      opportunityId,
    ].join(":");
  }

  private async writeAudit(
    record: SalesCoachingAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(record);
  }
}

export const createSalesCoachingRuntime = (
  dependencies:
    SalesCoachingRuntimeDependencies,
): SalesCoachingRuntime =>
  new SalesCoachingRuntime(dependencies);

