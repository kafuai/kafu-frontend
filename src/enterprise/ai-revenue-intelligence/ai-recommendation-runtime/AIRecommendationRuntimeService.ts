import {
  AIRecommendationRuntime,
} from "./AIRecommendationRuntime";
import type {
  AIRecommendation,
  AIRecommendationAcceptanceRequest,
  AIRecommendationAssignmentRequest,
  AIRecommendationCandidate,
  AIRecommendationCompletionRequest,
  AIRecommendationContext,
  AIRecommendationDismissalRequest,
  AIRecommendationGenerationResult,
  AIRecommendationQuery,
  AIRecommendationStartRequest,
} from "./AIRecommendationRuntimeTypes";

export interface AIRecommendationCandidateProvider {
  collectCandidates(
    input: {
      tenantId: string;
      workspaceId?: string;

      periodStart?: string;
      periodEnd?: string;

      requestedBy?: string;
      correlationId?: string;
      reason?: string;
    },
  ): Promise<
    readonly AIRecommendationCandidate[]
  >;
}

export interface AIRecommendationRuntimeServiceDependencies {
  runtime:
    AIRecommendationRuntime;

  candidateProviders?:
    readonly AIRecommendationCandidateProvider[];
}

export class AIRecommendationRuntimeService {
  private readonly runtime:
    AIRecommendationRuntime;

  private readonly candidateProviders:
    readonly AIRecommendationCandidateProvider[];

  constructor(
    dependencies:
      AIRecommendationRuntimeServiceDependencies,
  ) {
    this.runtime =
      dependencies.runtime;

    this.candidateProviders =
      dependencies.candidateProviders
      ?? [];
  }

  async generate(
    context:
      AIRecommendationContext,
  ): Promise<AIRecommendationGenerationResult> {
    return this.runtime.generate(
      context,
    );
  }

  async generateFromProviders(
    input: {
      tenantId: string;
      workspaceId?: string;

      periodStart?: string;
      periodEnd?: string;

      requestedBy?: string;
      correlationId?: string;
      reason?: string;

      metadata?:
        Readonly<Record<string, unknown>>;
    },
  ): Promise<AIRecommendationGenerationResult> {
    const candidateGroups =
      await Promise.all(
        this.candidateProviders.map(
          (provider) =>
            provider.collectCandidates(
              input,
            ),
        ),
      );

    const candidates =
      candidateGroups.flat();

    return this.runtime.generate({
      tenantId:
        input.tenantId,

      workspaceId:
        input.workspaceId,

      periodStart:
        input.periodStart,

      periodEnd:
        input.periodEnd,

      requestedBy:
        input.requestedBy,

      correlationId:
        input.correlationId,

      reason:
        input.reason
        ?? "provider-orchestration",

      metadata:
        input.metadata,

      candidates,
    });
  }

  async list(
    query:
      AIRecommendationQuery,
    actorId?: string,
    correlationId?: string,
  ): Promise<
    readonly AIRecommendation[]
  > {
    return this.runtime.query(
      query,
      actorId,
      correlationId,
    );
  }

  async assign(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationAssignmentRequest,
  ): Promise<AIRecommendation> {
    return this.runtime.assign(
      tenantId,
      workspaceId,
      request,
    );
  }

  async accept(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationAcceptanceRequest,
  ): Promise<AIRecommendation> {
    return this.runtime.accept(
      tenantId,
      workspaceId,
      request,
    );
  }

  async start(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationStartRequest,
  ): Promise<AIRecommendation> {
    return this.runtime.start(
      tenantId,
      workspaceId,
      request,
    );
  }

  async complete(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationCompletionRequest,
  ): Promise<AIRecommendation> {
    return this.runtime.complete(
      tenantId,
      workspaceId,
      request,
    );
  }

  async dismiss(
    tenantId: string,
    workspaceId: string | undefined,
    request:
      AIRecommendationDismissalRequest,
  ): Promise<AIRecommendation> {
    return this.runtime.dismiss(
      tenantId,
      workspaceId,
      request,
    );
  }

  async expire(
    tenantId: string,
    workspaceId?: string,
    correlationId?: string,
  ): Promise<
    readonly AIRecommendation[]
  > {
    return this.runtime
      .expireRecommendations(
        tenantId,
        workspaceId,
        correlationId,
      );
  }
}

export const createAIRecommendationRuntimeService = (
  dependencies:
    AIRecommendationRuntimeServiceDependencies,
): AIRecommendationRuntimeService =>
  new AIRecommendationRuntimeService(
    dependencies,
  );
