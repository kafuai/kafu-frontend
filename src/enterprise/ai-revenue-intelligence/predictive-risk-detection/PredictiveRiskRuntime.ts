import {
  PredictiveRiskEngine,
} from "./PredictiveRiskEngine";
import {
  assertPredictiveRiskRepository,
} from "./PredictiveRiskRepository";
import type {
  PredictiveRiskRepository,
} from "./PredictiveRiskRepository";
import type {
  PredictiveRiskAssessment,
  PredictiveRiskAuditRecord,
  PredictiveRiskClock,
  PredictiveRiskConfiguration,
  PredictiveRiskEvent,
  PredictiveRiskHistoryEntry,
  PredictiveRiskIdGenerator,
  PredictiveRiskQuery,
  PredictiveRiskRequest,
} from "./PredictiveRiskTypes";

export interface PredictiveRiskCache {
  get(
    key: string,
  ): Promise<
    PredictiveRiskAssessment | null
  >;

  set(
    key: string,
    assessment:
      PredictiveRiskAssessment,
    ttlMs: number,
  ): Promise<void>;

  delete(
    key: string,
  ): Promise<void>;
}

export interface PredictiveRiskEventPublisher {
  publish(
    event: PredictiveRiskEvent,
  ): Promise<void>;
}

export interface PredictiveRiskAuditWriter {
  write(
    record:
      PredictiveRiskAuditRecord,
  ): Promise<void>;
}

export interface PredictiveRiskRuntimeDependencies {
  engine:
    PredictiveRiskEngine;

  repository:
    PredictiveRiskRepository;

  cache?:
    PredictiveRiskCache;

  eventPublisher?:
    PredictiveRiskEventPublisher;

  auditWriter?:
    PredictiveRiskAuditWriter;

  clock?:
    PredictiveRiskClock;

  idGenerator?:
    PredictiveRiskIdGenerator;

  configuration?:
    Partial<PredictiveRiskConfiguration>;
}

const DEFAULT_CONFIGURATION:
  PredictiveRiskConfiguration = {
    modelVersion: "5.0.0",
    assessmentTtlHours: 12,

    criticalRiskThreshold: 80,
    highRiskThreshold: 60,
    mediumRiskThreshold: 35,

    staleActivityDays: 14,
    criticalActivityDays: 30,

    slowStageDays: 21,
    criticalStageDays: 45,

    criticalCoverageRatio: 0.6,
    highCoverageRatio: 1,

    concentrationRiskPercentage: 40,
    criticalConcentrationPercentage: 65,

    materialRiskScoreChange: 10,

    maximumRisks: 24,
    maximumRecommendations: 16,
  };

const systemClock:
  PredictiveRiskClock = {
    now: () => new Date(),
  };

const systemIdGenerator:
  PredictiveRiskIdGenerator = {
    next: () =>
      globalThis.crypto.randomUUID(),
  };

export class PredictiveRiskRuntime {
  private readonly engine:
    PredictiveRiskEngine;

  private readonly repository:
    PredictiveRiskRepository;

  private readonly cache?:
    PredictiveRiskCache;

  private readonly eventPublisher?:
    PredictiveRiskEventPublisher;

  private readonly auditWriter?:
    PredictiveRiskAuditWriter;

  private readonly clock:
    PredictiveRiskClock;

  private readonly idGenerator:
    PredictiveRiskIdGenerator;

  private readonly configuration:
    PredictiveRiskConfiguration;

  constructor(
    dependencies:
      PredictiveRiskRuntimeDependencies,
  ) {
    this.engine =
      dependencies.engine;

    this.repository =
      assertPredictiveRiskRepository(
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
      PredictiveRiskQuery,
  ): Promise<
    PredictiveRiskAssessment | null
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

        action:
          "cache-hit",

        occurredAt:
          this.clock.now().toISOString(),

        details: {
          assessmentId:
            cached.id,

          overallRiskScore:
            cached.overallRiskScore,

          overallSeverity:
            cached.overallSeverity,
        },
      });

      return cached;
    }

    await this.writeAudit({
      tenantId:
        query.tenantId,

      workspaceId:
        query.workspaceId,

      action:
        "cache-miss",

      occurredAt:
        this.clock.now().toISOString(),

      details: {
        periodStart:
          query.periodStart,

        periodEnd:
          query.periodEnd,
      },
    });

    const assessment =
      await this.repository.findLatest(
        query,
      );

    if (
      assessment
      && this.cache
    ) {
      await this.cache.set(
        cacheKey,
        assessment,
        this.resolveCacheTtlMs(
          assessment,
        ),
      );
    }

    return assessment;
  }

  async generate(
    request:
      PredictiveRiskRequest,
  ): Promise<PredictiveRiskAssessment> {
    const { context } = request;

    const query:
      PredictiveRiskQuery = {
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
          {
            ...context,

            previousAssessment:
              context.previousAssessment
              ?? (
                previous
                  ? {
                    assessedAt:
                      previous.generatedAt,

                    overallRiskScore:
                      previous.overallRiskScore,

                    criticalRiskCount:
                      previous.criticalRiskCount,

                    highRiskCount:
                      previous.highRiskCount,
                  }
                  : undefined
              ),
          },
          this.clock.now(),
        );

      const persisted =
        await this.repository.saveAssessment({
          ...generated,

          id:
            generated.id
            || this.idGenerator.next(),

          risks:
            generated.risks.map(
              (risk) => ({
                ...risk,

                id:
                  risk.id
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
        PredictiveRiskHistoryEntry = {
          id:
            this.idGenerator.next(),

          assessmentId:
            persisted.id,

          tenantId:
            persisted.tenantId,

          workspaceId:
            persisted.workspaceId,

          periodStart:
            persisted.periodStart,

          periodEnd:
            persisted.periodEnd,

          overallRiskScore:
            persisted.overallRiskScore,

          overallSeverity:
            persisted.overallSeverity,

          totalAmountAtRisk:
            persisted.totalAmountAtRisk,

          expectedRevenueLoss:
            persisted.expectedRevenueLoss,

          criticalRiskCount:
            persisted.criticalRiskCount,

          highRiskCount:
            persisted.highRiskCount,

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
          assessmentId:
            persisted.id,

          overallRiskScore:
            persisted.overallRiskScore,

          overallSeverity:
            persisted.overallSeverity,

          riskCount:
            persisted.riskCount,

          criticalRiskCount:
            persisted.criticalRiskCount,

          totalAmountAtRisk:
            persisted.totalAmountAtRisk,

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
          : "Unknown predictive risk failure.";

      await this.writeAudit({
        tenantId:
          context.tenantId,

        workspaceId:
          context.workspaceId,

        action:
          "failure",

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
          "predictive-risk.failed",

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
      PredictiveRiskRequest,
  ): Promise<PredictiveRiskAssessment> {
    const query:
      PredictiveRiskQuery = {
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
      PredictiveRiskAssessment | null,
    current:
      PredictiveRiskAssessment,
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
        "predictive-risk.generated",

      tenantId:
        current.tenantId,

      workspaceId:
        current.workspaceId,

      occurredAt:
        this.clock.now().toISOString(),

      correlationId,

      payload: {
        assessmentId:
          current.id,

        overallRiskScore:
          current.overallRiskScore,

        overallSeverity:
          current.overallSeverity,

        riskCount:
          current.riskCount,

        criticalRiskCount:
          current.criticalRiskCount,

        highRiskCount:
          current.highRiskCount,

        totalAmountAtRisk:
          current.totalAmountAtRisk,

        expectedRevenueLoss:
          current.expectedRevenueLoss,

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
          "predictive-risk.material-change",

        tenantId:
          current.tenantId,

        workspaceId:
          current.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          previousAssessmentId:
            previous?.id,

          currentAssessmentId:
            current.id,

          previousRiskScore:
            previous?.overallRiskScore,

          currentRiskScore:
            current.overallRiskScore,

          previousSeverity:
            previous?.overallSeverity,

          currentSeverity:
            current.overallSeverity,

          previousCriticalRiskCount:
            previous?.criticalRiskCount,

          currentCriticalRiskCount:
            current.criticalRiskCount,
        },
      });
    }

    if (
      current.overallSeverity
        === "critical"
      || current.criticalRiskCount > 0
    ) {
      await this.eventPublisher.publish({
        eventId:
          this.idGenerator.next(),

        eventType:
          "predictive-risk.critical",

        tenantId:
          current.tenantId,

        workspaceId:
          current.workspaceId,

        occurredAt:
          this.clock.now().toISOString(),

        correlationId,

        payload: {
          assessmentId:
            current.id,

          overallRiskScore:
            current.overallRiskScore,

          totalAmountAtRisk:
            current.totalAmountAtRisk,

          criticalRisks:
            current.risks
              .filter(
                (risk) =>
                  risk.severity
                  === "critical",
              )
              .map(
                (risk) => ({
                  id:
                    risk.id,

                  scope:
                    risk.scope,

                  category:
                    risk.category,

                  title:
                    risk.title,

                  amountAtRisk:
                    risk.amountAtRisk,

                  recommendedAction:
                    risk.recommendedAction,
                }),
              ),

          priorityAction:
            current.summary
              .priorityAction,
        },
      });
    }
  }

  private isMaterialChange(
    previous:
      PredictiveRiskAssessment | null,
    current:
      PredictiveRiskAssessment,
  ): boolean {
    if (!previous) {
      return true;
    }

    if (
      Math.abs(
        current.overallRiskScore
        - previous.overallRiskScore,
      )
      >= this.configuration
        .materialRiskScoreChange
    ) {
      return true;
    }

    if (
      previous.overallSeverity
      !== current.overallSeverity
    ) {
      return true;
    }

    if (
      previous.criticalRiskCount
      !== current.criticalRiskCount
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
    assessment:
      PredictiveRiskAssessment,
  ): number {
    const expiresAt =
      new Date(
        assessment.expiresAt,
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
        .assessmentTtlHours
      * 60
      * 60
      * 1000
    );
  }

  private createCacheKey(
    query:
      PredictiveRiskQuery,
  ): string {
    return [
      "ai-revenue-intelligence",
      "predictive-risk-detection",
      query.tenantId,
      query.workspaceId
        ?? "default",
      query.periodStart,
      query.periodEnd,
    ].join(":");
  }

  private async writeAudit(
    record:
      PredictiveRiskAuditRecord,
  ): Promise<void> {
    await this.auditWriter?.write(
      record,
    );
  }
}

export const createPredictiveRiskRuntime = (
  dependencies:
    PredictiveRiskRuntimeDependencies,
): PredictiveRiskRuntime =>
  new PredictiveRiskRuntime(
    dependencies,
  );
