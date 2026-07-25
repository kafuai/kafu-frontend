import {
  AIRecommendationRuntimeEngine,
} from "./AIRecommendationRuntimeEngine";
import {
  assertAIRecommendationRepository,
} from "./AIRecommendationRuntimeRepository";
import type {
  AIRecommendationRepository,
} from "./AIRecommendationRuntimeRepository";
import type {
  AIRecommendation,
  AIRecommendationAcceptanceRequest,
  AIRecommendationAssignmentRequest,
  AIRecommendationAuditRecord,
  AIRecommendationClock,
  AIRecommendationCompletionRequest,
  AIRecommendationConfiguration,
  AIRecommendationContext,
  AIRecommendationDismissalRequest,
  AIRecommendationEvent,
  AIRecommendationGenerationResult,
  AIRecommendationHistoryEntry,
  AIRecommendationIdGenerator,
  AIRecommendationQuery,
  AIRecommendationStartRequest,
  AIRecommendationStatus,
} from "./AIRecommendationRuntimeTypes";

export interface AIRecommendationEventPublisher {
  publish(
    event: AIRecommendationEvent,
  ): Promise<void>;
}

export interface AIRecommendationAuditWriter {
  write(
    record:
      AIRecommendationAuditRecord,
  ): Promise<void>;
}

export interface AIRecommendationRuntimeDependencies {
  engine:
    AIRecommendationRuntimeEngine;

  repository:
    AIRecommendationRepository;

  eventPublisher?:
    AIRecommendationEventPublisher;

  auditWriter?:
    AIRecommendationAuditWriter;

  clock?:
    AIRecommendationClock;

  idGenerator?:
    AIRecommendationIdGenerator;

  configuration?:
    Partial<AIRecommendationConfiguration>;
}

const DEFAULT_CONFIGURATION:
  AIRecommendationConfiguration = {
    modelVersion: "5.0.0",

    defaultExpirationHours: 168,
    criticalExpirationHours: 24,
    highExpirationHours: 72,

    maximumRecommendationsPerRun: 100,

    duplicateWindowHours: 72,
    materialConfidenceThreshold: 45,

    criticalScoreThreshold: 80,
    highScoreThreshold: 65,
    mediumScoreThreshold: 40,
  };

const systemClock:
  AIRecommendationClock = {
    now: () => new Date(),
  };

const systemIdGenerator:
  AIRecommendationIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class AIRecommendationRuntime {
  private readonly engine:
    AIRecommendationRuntimeEngine;

  private readonly repository:
    AIRecommendationRepository;

  private readonly eventPublisher?:
    AIRecommendationEventPublisher;

  private readonly auditWriter?:
    AIRecommendationAuditWriter;

  private readonly clock:
    AIRecommendationClock;

  private readonly idGenerator:
    AIRecommendationIdGenerator;

  private readonly configuration:
    AIRecommendationConfiguration;

  constructor(
    dependencies:
      AIRecommendationRuntimeDependencies,
  ) {
    this.engine =
      dependencies.engine;

    this.repository =
      assertAIRecommendationRepository(
        dependencies.repository,
      );

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

  async generate(
    context:
      AIRecommendationContext,
  ): Promise<AIRecommendationGenerationResult> {
    try {
      const generated =
        this.engine.generate(
          context,
          this.clock.now(),
        );

      const existing =
        generated.recommendations.length > 0
          ? await this.repository
            .findActiveByDeduplicationKeys(
              context.tenantId,
              generated.recommendations.map(
                (recommendation) =>
                  recommendation
                    .deduplicationKey,
              ),
              context.workspaceId,
            )
          : [];

      const activeKeys =
        new Set(
          existing.map(
            (recommendation) =>
              recommendation
                .deduplicationKey,
          ),
        );

      const newRecommendations =
        generated.recommendations
          .filter(
            (recommendation) =>
              !activeKeys.has(
                recommendation
                  .deduplicationKey,
              ),
          )
          .map(
            (recommendation) => ({
              ...recommendation,

              id:
                recommendation.id
                || this.idGenerator.next(),
            }),
          );

      const persisted =
        await this.repository.saveMany(
          newRecommendations,
        );

      for (
        const recommendation
        of persisted
      ) {
        await this.appendHistory(
          recommendation,
          undefined,
          "generated",
          context.requestedBy,
          context.correlationId,
          context.reason,
        );

        await this.publishEvent({
          eventId:
            this.idGenerator.next(),

          eventType:
            recommendation.priority
              === "critical"
              ? "ai-recommendation.critical"
              : "ai-recommendation.generated",

          tenantId:
            recommendation.tenantId,

          workspaceId:
            recommendation.workspaceId,

          occurredAt:
            this.clock.now().toISOString(),

          correlationId:
            recommendation.correlationId,

          payload: {
            recommendationId:
              recommendation.id,

            source:
              recommendation.source,

            category:
              recommendation.category,

            scope:
              recommendation.scope,

            priority:
              recommendation.priority,

            title:
              recommendation.title,

            recommendationScore:
              recommendation
                .recommendationScore,

            amountAtRisk:
              recommendation
                .amountAtRisk,

            expectedRevenueImpact:
              recommendation
                .expectedRevenueImpact,

            dueAt:
              recommendation.dueAt,
          },
        });
      }

      const result:
        AIRecommendationGenerationResult = {
          ...generated,

          deduplicatedCandidateCount:
            persisted.length,

          recommendations:
            persisted,

          summary:
            this.buildQueueSummary(
              persisted,
            ),
        };

      await this.writeAudit({
        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        action: "generate",

        actorId:
          context.requestedBy,

        correlationId:
          context.correlationId,

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          receivedCandidateCount:
            context.candidates.length,

          generatedRecommendationCount:
            persisted.length,

          duplicateRecommendationCount:
            existing.length,

          criticalRecommendationCount:
            result.summary.critical,

          highRecommendationCount:
            result.summary.high,

          managementAttentionRequired:
            result.summary
              .managementAttentionRequired,
        },
      });

      return result;
    } catch (error) {
      await this.handleFailure(
        context,
        error,
      );

      throw error;
    }
  }

  async query(
    query: AIRecommendationQuery,
    actorId?: string,
    correlationId?: string,
  ): Promise<
    readonly AIRecommendation[]
  > {
    await this.expireRecommendations(
      query.tenantId,
      query.workspaceId,
      correlationId,
    );

    const recommendations =
      await this.repository.findMany(
        query,
      );

    await this.writeAudit({
      tenantId:
        query.tenantId,

      workspaceId:
        query.workspaceId,

      action: "query",

      actorId,
      correlationId,

      occurredAt:
        this.clock.now().toISOString(),

      details: {
        resultCount:
          recommendations.length,

        statuses:
          query.statuses,

        priorities:
          query.priorities,

        categories:
          query.categories,

        opportunityId:
          query.opportunityId,

        ownerId:
          query.ownerId,
      },
    });

    return recommendations;
  }

  async assign(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationAssignmentRequest,
  ): Promise<AIRecommendation> {
    const current =
      await this.requireRecommendation(
        tenantId,
        request.recommendationId,
        workspaceId,
      );

    this.assertTransition(
      current.status,
      "assigned",
    );

    const now =
      this.clock.now().toISOString();

    const updated =
      await this.repository.updateStatus(
        tenantId,
        current.id,
        "assigned",
        {
          assignedTo:
            request.assignedTo,

          assignedBy:
            request.actorId,

          assignedAt: now,
        },
        workspaceId,
      );

    await this.appendHistory(
      updated,
      current.status,
      "assigned",
      request.actorId,
      request.correlationId,
      request.note,
    );

    await this.publishLifecycleEvent(
      "ai-recommendation.assigned",
      updated,
      request.correlationId,
    );

    await this.writeMutationAudit(
      "assign",
      updated,
      request.actorId,
      request.correlationId,
      {
        assignedTo:
          request.assignedTo,

        note:
          request.note,
      },
    );

    return updated;
  }

  async accept(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationAcceptanceRequest,
  ): Promise<AIRecommendation> {
    return this.transition({
      tenantId,
      workspaceId,

      recommendationId:
        request.recommendationId,

      nextStatus: "accepted",

      historyAction: "accepted",

      eventType:
        "ai-recommendation.accepted",

      auditAction: "accept",

      actorId:
        request.actorId,

      correlationId:
        request.correlationId,

      note:
        request.note,

      changes: {
        acceptedBy:
          request.actorId,

        acceptedAt:
          this.clock.now()
            .toISOString(),
      },
    });
  }

  async start(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationStartRequest,
  ): Promise<AIRecommendation> {
    return this.transition({
      tenantId,
      workspaceId,

      recommendationId:
        request.recommendationId,

      nextStatus: "in-progress",

      historyAction: "started",

      eventType:
        "ai-recommendation.started",

      auditAction: "start",

      actorId:
        request.actorId,

      correlationId:
        request.correlationId,

      note:
        request.note,

      changes: {
        startedBy:
          request.actorId,

        startedAt:
          this.clock.now()
            .toISOString(),
      },
    });
  }

  async complete(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationCompletionRequest,
  ): Promise<AIRecommendation> {
    return this.transition({
      tenantId,
      workspaceId,

      recommendationId:
        request.recommendationId,

      nextStatus: "completed",

      historyAction: "completed",

      eventType:
        "ai-recommendation.completed",

      auditAction: "complete",

      actorId:
        request.actorId,

      correlationId:
        request.correlationId,

      note:
        request.completionNote
        ?? request.note,

      changes: {
        completedBy:
          request.actorId,

        completedAt:
          this.clock.now()
            .toISOString(),

        completionNote:
          request.completionNote
          ?? request.note,
      },
    });
  }

  async dismiss(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationDismissalRequest,
  ): Promise<AIRecommendation> {
    return this.transition({
      tenantId,
      workspaceId,

      recommendationId:
        request.recommendationId,

      nextStatus: "dismissed",

      historyAction: "dismissed",

      eventType:
        "ai-recommendation.dismissed",

      auditAction: "dismiss",

      actorId:
        request.actorId,

      correlationId:
        request.correlationId,

      note:
        request.dismissalReason,

      changes: {
        dismissedBy:
          request.actorId,

        dismissedAt:
          this.clock.now()
            .toISOString(),

        dismissalReason:
          request.dismissalReason,
      },
    });
  }

  async expireRecommendations(
    tenantId: string,
    workspaceId?: string,
    correlationId?: string,
  ): Promise<
    readonly AIRecommendation[]
  > {
    const now =
      this.clock.now();

    const expired =
      await this.repository
        .expireDueRecommendations(
          tenantId,
          now.toISOString(),
          workspaceId,
        );

    for (
      const recommendation
      of expired
    ) {
      await this.appendHistory(
        recommendation,
        "pending",
        "expired",
        undefined,
        correlationId,
        "Recommendation expiration threshold reached.",
      );

      await this.publishLifecycleEvent(
        "ai-recommendation.expired",
        recommendation,
        correlationId,
      );

      await this.writeMutationAudit(
        "expire",
        recommendation,
        undefined,
        correlationId,
        {
          expiresAt:
            recommendation.expiresAt,
        },
      );
    }

    return expired;
  }

  private async transition(
    input: {
      tenantId: string;
      workspaceId?: string;

      recommendationId: string;

      nextStatus:
        AIRecommendationStatus;

      historyAction:
        AIRecommendationHistoryEntry["action"];

      eventType:
        AIRecommendationEvent["eventType"];

      auditAction:
        AIRecommendationAuditRecord["action"];

      actorId: string;
      correlationId?: string;
      note?: string;

      changes:
        Partial<AIRecommendation>;
    },
  ): Promise<AIRecommendation> {
    const current =
      await this.requireRecommendation(
        input.tenantId,
        input.recommendationId,
        input.workspaceId,
      );

    this.assertTransition(
      current.status,
      input.nextStatus,
    );

    const updated =
      await this.repository.updateStatus(
        input.tenantId,
        input.recommendationId,
        input.nextStatus,
        input.changes,
        input.workspaceId,
      );

    await this.appendHistory(
      updated,
      current.status,
      input.historyAction,
      input.actorId,
      input.correlationId,
      input.note,
    );

    await this.publishLifecycleEvent(
      input.eventType,
      updated,
      input.correlationId,
    );

    await this.writeMutationAudit(
      input.auditAction,
      updated,
      input.actorId,
      input.correlationId,
      {
        previousStatus:
          current.status,

        currentStatus:
          updated.status,

        note:
          input.note,
      },
    );

    return updated;
  }

  private assertTransition(
    current:
      AIRecommendationStatus,
    next:
      AIRecommendationStatus,
  ): void {
    const allowed:
      Readonly<Record<
        AIRecommendationStatus,
        readonly AIRecommendationStatus[]
      >> = {
        pending: [
          "assigned",
          "accepted",
          "in-progress",
          "completed",
          "dismissed",
          "expired",
          "failed",
        ],

        assigned: [
          "accepted",
          "in-progress",
          "completed",
          "dismissed",
          "expired",
          "failed",
        ],

        accepted: [
          "in-progress",
          "completed",
          "dismissed",
          "expired",
          "failed",
        ],

        "in-progress": [
          "completed",
          "dismissed",
          "expired",
          "failed",
        ],

        completed: [],
        dismissed: [],
        expired: [],
        failed: [],
      };

    if (
      !allowed[current].includes(
        next,
      )
    ) {
      throw new Error(
        `Invalid AI recommendation transition from "${current}" to "${next}".`,
      );
    }
  }

  private async requireRecommendation(
    tenantId: string,
    recommendationId: string,
    workspaceId?: string,
  ): Promise<AIRecommendation> {
    const recommendation =
      await this.repository.findById(
        tenantId,
        recommendationId,
        workspaceId,
      );

    if (!recommendation) {
      throw new Error(
        `AI recommendation "${recommendationId}" was not found.`,
      );
    }

    return recommendation;
  }

  private async appendHistory(
    recommendation:
      AIRecommendation,
    previousStatus:
      AIRecommendationStatus
      | undefined,
    action:
      AIRecommendationHistoryEntry["action"],
    actorId?: string,
    correlationId?: string,
    note?: string,
  ): Promise<void> {
    await this.repository.appendHistory({
      id:
        this.idGenerator.next(),

      recommendationId:
        recommendation.id,

      tenantId:
        recommendation.tenantId,

      workspaceId:
        recommendation.workspaceId,

      previousStatus,

      currentStatus:
        recommendation.status,

      action,

      actorId,

      occurredAt:
        this.clock.now().toISOString(),

      note,
      correlationId,
    });
  }

  private async publishLifecycleEvent(
    eventType:
      AIRecommendationEvent["eventType"],
    recommendation:
      AIRecommendation,
    correlationId?: string,
  ): Promise<void> {
    await this.publishEvent({
      eventId:
        this.idGenerator.next(),

      eventType,

      tenantId:
        recommendation.tenantId,

      workspaceId:
        recommendation.workspaceId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId,

      payload: {
        recommendationId:
          recommendation.id,

        source:
          recommendation.source,

        category:
          recommendation.category,

        priority:
          recommendation.priority,

        status:
          recommendation.status,

        title:
          recommendation.title,

        assignedTo:
          recommendation.assignedTo,

        opportunityId:
          recommendation.opportunityId,

        ownerId:
          recommendation.ownerId,

        accountId:
          recommendation.accountId,
      },
    });
  }

  private async publishEvent(
    event:
      AIRecommendationEvent,
  ): Promise<void> {
    await this.eventPublisher?.publish(
      event,
    );
  }

  private async writeMutationAudit(
    action:
      AIRecommendationAuditRecord["action"],
    recommendation:
      AIRecommendation,
    actorId?: string,
    correlationId?: string,
    details:
      Readonly<Record<string, unknown>> = {},
  ): Promise<void> {
    await this.writeAudit({
      tenantId:
        recommendation.tenantId,

      workspaceId:
        recommendation.workspaceId,

      recommendationId:
        recommendation.id,

      action,
      actorId,
      correlationId,

      occurredAt:
        this.clock.now().toISOString(),

      details: {
        status:
          recommendation.status,

        priority:
          recommendation.priority,

        category:
          recommendation.category,

        ...details,
      },
    });
  }

  private async handleFailure(
    context:
      AIRecommendationContext,
    error: unknown,
  ): Promise<void> {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown AI recommendation runtime failure.";

    await this.writeAudit({
      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      action: "failure",

      actorId:
        context.requestedBy,

      correlationId:
        context.correlationId,

      occurredAt:
        this.clock.now().toISOString(),

      details: {
        message,

        candidateCount:
          context.candidates.length,
      },
    });

    await this.publishEvent({
      eventId:
        this.idGenerator.next(),

      eventType:
        "ai-recommendation.failed",

      tenantId:
        context.tenantId,

      workspaceId:
        context.workspaceId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId:
        context.correlationId,

      payload: {
        message,

        candidateCount:
          context.candidates.length,

        reason:
          context.reason,
      },
    });
  }

  private buildQueueSummary(
    recommendations:
      readonly AIRecommendation[],
  ): AIRecommendationGenerationResult["summary"] {
    const countStatus = (
      status:
        AIRecommendationStatus,
    ): number =>
      recommendations.filter(
        (recommendation) =>
          recommendation.status === status,
      ).length;

    const countPriority = (
      priority:
        AIRecommendation["priority"],
    ): number =>
      recommendations.filter(
        (recommendation) =>
          recommendation.priority
          === priority,
      ).length;

    const primary =
      [...recommendations].sort(
        (left, right) =>
          right.recommendationScore
          - left.recommendationScore,
      )[0];

    return {
      total:
        recommendations.length,

      pending:
        countStatus("pending"),

      assigned:
        countStatus("assigned"),

      accepted:
        countStatus("accepted"),

      inProgress:
        countStatus("in-progress"),

      completed:
        countStatus("completed"),

      dismissed:
        countStatus("dismissed"),

      expired:
        countStatus("expired"),

      failed:
        countStatus("failed"),

      critical:
        countPriority("critical"),

      high:
        countPriority("high"),

      medium:
        countPriority("medium"),

      low:
        countPriority("low"),

      totalAmountAtRisk:
        this.round(
          recommendations.reduce(
            (total, recommendation) =>
              total
              + (
                recommendation
                  .amountAtRisk
                ?? 0
              ),
            0,
          ),
        ),

      expectedRevenueImpact:
        this.round(
          recommendations.reduce(
            (total, recommendation) =>
              total
              + (
                recommendation
                  .expectedRevenueImpact
                ?? 0
              ),
            0,
          ),
        ),

      managementAttentionRequired:
        recommendations.some(
          (recommendation) =>
            recommendation.priority
            === "critical",
        )
        || countPriority("high") >= 3,

      primaryRecommendationId:
        primary?.id,

      primaryRecommendationTitle:
        primary?.title,
    };
  }

  private async writeAudit(
    record:
      AIRecommendationAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(
      record,
    );
  }

  private round(
    value: number,
  ): number {
    return Math.round(
      (
        value
        + Number.EPSILON
      ) * 100,
    ) / 100;
  }
}

export const createAIRecommendationRuntime = (
  dependencies:
    AIRecommendationRuntimeDependencies,
): AIRecommendationRuntime =>
  new AIRecommendationRuntime(
    dependencies,
  );
