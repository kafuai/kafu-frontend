import type {
  NextBestActionAuditRecord,
  NextBestActionClock,
  NextBestActionConfiguration,
  NextBestActionEvent,
  NextBestActionIdGenerator,
  NextBestActionPlan,
  NextBestActionRequest,
  NextBestActionStatusUpdate,
  NextBestActionRecommendation,
} from "./NextBestActionTypes";
import {
  NextBestActionEngine,
} from "./NextBestActionEngine";
import {
  assertNextBestActionRepository,
  type NextBestActionRepository,
} from "./NextBestActionRepository";

export interface NextBestActionEventPublisher {
  publish(
    event: NextBestActionEvent,
  ): Promise<void>;
}

export interface NextBestActionAuditWriter {
  write(
    record: NextBestActionAuditRecord,
  ): Promise<void>;
}

export interface NextBestActionCache {
  get(
    key: string,
  ): Promise<NextBestActionPlan | null>;

  set(
    key: string,
    plan: NextBestActionPlan,
    ttlMs: number,
  ): Promise<void>;

  delete(key: string): Promise<void>;
}

export interface NextBestActionRuntimeDependencies {
  engine: NextBestActionEngine;
  repository: NextBestActionRepository;

  cache?: NextBestActionCache;
  eventPublisher?:
    NextBestActionEventPublisher;
  auditWriter?:
    NextBestActionAuditWriter;

  clock?: NextBestActionClock;
  idGenerator?:
    NextBestActionIdGenerator;

  configuration?: Partial<
    NextBestActionConfiguration
  >;
}

const DEFAULT_CONFIGURATION:
  NextBestActionConfiguration = {
    modelVersion: "5.0.0",

    cacheTtlMs: 5 * 60 * 1000,

    planExpiryHours: 24,

    recommendationExpiryHours: 72,

    maximumRecommendations: 5,

    minimumRankScore: 25,

    minimumConfidence: 25,

    duplicateActionPenalty: 35,

    previousRecommendationPenalty: 10,
  };

const systemClock:
  NextBestActionClock = {
    now: () => new Date(),
  };

const systemIdGenerator:
  NextBestActionIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class NextBestActionRuntime {
  private readonly engine:
    NextBestActionEngine;

  private readonly repository:
    NextBestActionRepository;

  private readonly cache?:
    NextBestActionCache;

  private readonly eventPublisher?:
    NextBestActionEventPublisher;

  private readonly auditWriter?:
    NextBestActionAuditWriter;

  private readonly clock:
    NextBestActionClock;

  private readonly idGenerator:
    NextBestActionIdGenerator;

  private readonly configuration:
    NextBestActionConfiguration;

  constructor(
    dependencies:
      NextBestActionRuntimeDependencies,
  ) {
    this.engine =
      dependencies.engine;

    this.repository =
      assertNextBestActionRepository(
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
  ): Promise<NextBestActionPlan | null> {
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

    const plan =
      await this.repository.findLatestPlan({
        tenantId,
        workspaceId,
        opportunityId,
      });

    if (
      plan
      && this.cache
    ) {
      await this.cache.set(
        cacheKey,
        plan,
        this.configuration.cacheTtlMs,
      );
    }

    return plan;
  }

  async generate(
    request: NextBestActionRequest,
  ): Promise<NextBestActionPlan> {
    const { context } = request;

    try {
      await this.repository
        .expireRecommendations(
          {
            tenantId:
              context.tenantId,

            workspaceId:
              context.workspaceId,

            opportunityId:
              context.opportunityId,
          },

          this.clock.now().toISOString(),
        );

      const calculated =
        this.engine.calculate(
          context,
          this.clock.now(),
          request.maximumRecommendations,
        );

      const recommendations =
        calculated.recommendations.map(
          (recommendation) => ({
            ...recommendation,

            id:
              recommendation.id
              ?? this.idGenerator.next(),
          }),
        );

      const persisted =
        await this.repository.savePlan({
          ...calculated,

          id:
            calculated.id
            ?? this.idGenerator.next(),

          recommendations,

          primaryRecommendation:
            recommendations[0],
        });

      const persistedRecommendations =
        await this.repository
          .saveRecommendations(
            persisted.recommendations,
          );

      const finalPlan:
        NextBestActionPlan = {
          ...persisted,

          recommendations:
            persistedRecommendations,

          primaryRecommendation:
            persistedRecommendations[0],
        };

      if (this.cache) {
        await this.cache.set(
          this.createCacheKey(
            finalPlan.tenantId,
            finalPlan.opportunityId,
            finalPlan.workspaceId,
          ),

          finalPlan,

          this.configuration.cacheTtlMs,
        );
      }

      await this.publishGeneratedEvents(
        finalPlan,
        request.correlationId,
      );

      await this.writeAudit({
        tenantId:
          finalPlan.tenantId,

        workspaceId:
          finalPlan.workspaceId,

        opportunityId:
          finalPlan.opportunityId,

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
          totalCandidates:
            finalPlan.totalCandidates,

          selectedRecommendations:
            finalPlan
              .selectedRecommendations,

          urgentCount:
            finalPlan.urgentCount,

          highPriorityCount:
            finalPlan.highPriorityCount,

          confidence:
            finalPlan.confidence,

          expectedRevenueImpact:
            finalPlan
              .expectedRevenueImpact,
        },
      });

      return finalPlan;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown next-best-action failure.";

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
          "next-best-action.failed",

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

  async regenerate(
    request: NextBestActionRequest,
  ): Promise<NextBestActionPlan> {
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
    });
  }

  async updateStatus(
    update: NextBestActionStatusUpdate,
  ): Promise<NextBestActionRecommendation> {
    const recommendation =
      await this.repository
        .findRecommendationById({
          tenantId:
            update.tenantId,

          workspaceId:
            update.workspaceId,

          opportunityId:
            update.opportunityId,

          recommendationId:
            update.recommendationId,
        });

    if (!recommendation) {
      throw new Error(
        "Next best action recommendation was not found.",
      );
    }

    const occurredAt =
      update.occurredAt
      ?? this.clock.now().toISOString();

    const persisted =
      await this.repository
        .updateRecommendationStatus({
          ...update,
          occurredAt,
        });

    await this.cache?.delete(
      this.createCacheKey(
        update.tenantId,
        update.opportunityId,
        update.workspaceId,
      ),
    );

    await this.eventPublisher?.publish({
      eventId:
        this.idGenerator.next(),

      eventType:
        "next-best-action.status-changed",

      tenantId:
        update.tenantId,

      workspaceId:
        update.workspaceId,

      opportunityId:
        update.opportunityId,

      recommendationId:
        update.recommendationId,

      occurredAt,

      correlationId:
        update.correlationId,

      payload: {
        previousStatus:
          recommendation.status,

        currentStatus:
          persisted.status,

        actionType:
          persisted.actionType,

        priority:
          persisted.priority,

        reason:
          update.reason,
      },
    });

    await this.writeAudit({
      tenantId:
        update.tenantId,

      workspaceId:
        update.workspaceId,

      opportunityId:
        update.opportunityId,

      recommendationId:
        update.recommendationId,

      action:
        "status-change",

      actorId:
        update.actorId,

      correlationId:
        update.correlationId,

      occurredAt,

      details: {
        previousStatus:
          recommendation.status,

        currentStatus:
          persisted.status,

        actionType:
          persisted.actionType,

        reason:
          update.reason,
      },
    });

    return persisted;
  }

  private async publishGeneratedEvents(
    plan: NextBestActionPlan,
    correlationId?: string,
  ): Promise<void> {
    if (!this.eventPublisher) {
      return;
    }

    await this.eventPublisher.publish({
      eventId:
        this.idGenerator.next(),

      eventType:
        "next-best-action.generated",

      tenantId:
        plan.tenantId,

      workspaceId:
        plan.workspaceId,

      opportunityId:
        plan.opportunityId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId,

      payload: {
        recommendationCount:
          plan.recommendations.length,

        primaryAction:
          plan.primaryRecommendation
            ?.actionType,

        urgentCount:
          plan.urgentCount,

        highPriorityCount:
          plan.highPriorityCount,

        confidence:
          plan.confidence,

        expectedRevenueImpact:
          plan.expectedRevenueImpact,

        modelVersion:
          plan.modelVersion,
      },
    });

    for (
      const recommendation
      of plan.recommendations
    ) {
      if (
        recommendation.priority
        !== "urgent"
      ) {
        continue;
      }

      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "next-best-action.urgent",

        tenantId:
          plan.tenantId,

        workspaceId:
          plan.workspaceId,

        opportunityId:
          plan.opportunityId,

        recommendationId:
          recommendation.id,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          actionType:
            recommendation.actionType,

          title:
            recommendation.title,

          dueAt:
            recommendation.dueAt,

          impactScore:
            recommendation.impactScore,

          urgencyScore:
            recommendation.urgencyScore,

          relatedRiskLevel:
            recommendation
              .relatedRiskLevel,
        },
      });

      await this.writeAudit({
        tenantId:
          plan.tenantId,

        workspaceId:
          plan.workspaceId,

        opportunityId:
          plan.opportunityId,

        recommendationId:
          recommendation.id,

        action:
          "urgent-recommendation",

        correlationId,

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          actionType:
            recommendation.actionType,

          title:
            recommendation.title,

          dueAt:
            recommendation.dueAt,
        },
      });
    }
  }

  private async writeAudit(
    record: NextBestActionAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(
      record,
    );
  }

  private createCacheKey(
    tenantId: string,
    opportunityId: string,
    workspaceId?: string,
  ): string {
    return [
      "ai-revenue-intelligence",
      "next-best-action",
      tenantId,
      workspaceId ?? "default",
      opportunityId,
    ].join(":");
  }
}
