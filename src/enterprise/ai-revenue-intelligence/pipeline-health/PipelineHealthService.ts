import type {
  PipelineHealthAssessment,
  PipelineHealthBatchFailure,
  PipelineHealthBatchRequest,
  PipelineHealthBatchResult,
  PipelineHealthContext,
  PipelineHealthHistoryEntry,
  PipelineHealthHistoryQuery,
  PipelineHealthQuery,
  PipelineHealthRequest,
} from "./PipelineHealthTypes";
import {
  PipelineHealthRuntime,
} from "./PipelineHealthRuntime";
import type {
  PipelineHealthRepository,
} from "./PipelineHealthRepository";

export interface PipelineHealthContextProvider {
  getContext(
    input:
      PipelineHealthQuery,
  ): Promise<PipelineHealthContext>;
}

export interface PipelineHealthServiceDependencies {
  runtime:
    PipelineHealthRuntime;

  repository:
    PipelineHealthRepository;

  contextProvider:
    PipelineHealthContextProvider;
}

export class PipelineHealthService {
  private readonly runtime:
    PipelineHealthRuntime;

  private readonly repository:
    PipelineHealthRepository;

  private readonly contextProvider:
    PipelineHealthContextProvider;

  constructor(
    dependencies:
      PipelineHealthServiceDependencies,
  ) {
    this.runtime =
      dependencies.runtime;

    this.repository =
      dependencies.repository;

    this.contextProvider =
      dependencies.contextProvider;
  }

  async getLatest(
    query:
      PipelineHealthQuery,
  ): Promise<
    PipelineHealthAssessment | null
  > {
    return this.runtime.getLatest(
      query,
    );
  }

  async generate(
    request:
      PipelineHealthRequest,
  ): Promise<PipelineHealthAssessment> {
    return this.runtime.generate(
      request,
    );
  }

  async generateForPeriod(
    input:
      PipelineHealthQuery & {
        requestedBy?: string;
        correlationId?: string;
        reason?: string;
      },
  ): Promise<PipelineHealthAssessment> {
    const context =
      await this.contextProvider
        .getContext(input);

    return this.runtime.generate({
      context,

      requestedBy:
        input.requestedBy,

      correlationId:
        input.correlationId,

      reason:
        input.reason,
    });
  }

  async regenerateForPeriod(
    input:
      PipelineHealthQuery & {
        requestedBy?: string;
        correlationId?: string;
        reason?: string;
      },
  ): Promise<PipelineHealthAssessment> {
    const context =
      await this.contextProvider
        .getContext(input);

    return this.runtime.regenerate({
      context,

      forceRefresh: true,

      requestedBy:
        input.requestedBy,

      correlationId:
        input.correlationId,

      reason:
        input.reason
        ?? "manual-regeneration",
    });
  }

  async generateBatch(
    request:
      PipelineHealthBatchRequest,
  ): Promise<PipelineHealthBatchResult> {
    const assessments:
      PipelineHealthAssessment[] = [];

    const failures:
      PipelineHealthBatchFailure[] = [];

    for (
      const context
      of request.contexts
    ) {
      try {
        const assessment =
          await this.runtime.generate({
            context,

            requestedBy:
              request.requestedBy,

            correlationId:
              request.correlationId,

            reason:
              "batch-generation",
          });

        assessments.push(
          assessment,
        );
      } catch (error) {
        failures.push({
          periodStart:
            context.periodStart,

          periodEnd:
            context.periodEnd,

          code:
            "PIPELINE_HEALTH_FAILED",

          message:
            error instanceof Error
              ? error.message
              : "Unknown pipeline health failure.",
        });
      }
    }

    return {
      requested:
        request.contexts.length,

      succeeded:
        assessments.length,

      failed:
        failures.length,

      assessments,
      failures,
    };
  }

  async getHistory(
    query:
      PipelineHealthHistoryQuery,
  ): Promise<
    readonly PipelineHealthHistoryEntry[]
  > {
    return this.repository.findHistory(
      query,
    );
  }

  async deleteAssessment(
    query:
      PipelineHealthQuery,
  ): Promise<void> {
    await this.repository
      .deleteAssessment(query);
  }
}

export const createPipelineHealthService = (
  dependencies:
    PipelineHealthServiceDependencies,
): PipelineHealthService =>
  new PipelineHealthService(
    dependencies,
  );
