import type {
  RevenuePredictionBatchRequest,
  RevenuePredictionBatchResult,
  RevenuePredictionContext,
  RevenuePredictionForecast,
  RevenuePredictionHistoryEntry,
  RevenuePredictionHistoryQuery,
  RevenuePredictionQuery,
  RevenuePredictionRequest,
} from "./RevenuePredictionTypes";
import {
  RevenuePredictionRuntime,
} from "./RevenuePredictionRuntime";
import type {
  RevenuePredictionRepository,
} from "./RevenuePredictionRepository";

export interface RevenuePredictionContextProvider {
  getContext(
    input: RevenuePredictionQuery,
  ): Promise<RevenuePredictionContext>;
}

export interface RevenuePredictionServiceDependencies {
  runtime:
    RevenuePredictionRuntime;

  repository:
    RevenuePredictionRepository;

  contextProvider:
    RevenuePredictionContextProvider;
}

export class RevenuePredictionService {
  private readonly runtime:
    RevenuePredictionRuntime;

  private readonly repository:
    RevenuePredictionRepository;

  private readonly contextProvider:
    RevenuePredictionContextProvider;

  constructor(
    dependencies:
      RevenuePredictionServiceDependencies,
  ) {
    this.runtime =
      dependencies.runtime;

    this.repository =
      dependencies.repository;

    this.contextProvider =
      dependencies.contextProvider;
  }

  async getLatest(
    query: RevenuePredictionQuery,
  ): Promise<
    RevenuePredictionForecast | null
  > {
    return this.runtime.getLatest(
      query,
    );
  }

  async generate(
    request: RevenuePredictionRequest,
  ): Promise<RevenuePredictionForecast> {
    return this.runtime.generate(
      request,
    );
  }

  async generateForPeriod(
    input: RevenuePredictionQuery & {
      requestedBy?: string;
      correlationId?: string;
      reason?: string;
    },
  ): Promise<RevenuePredictionForecast> {
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
    input: RevenuePredictionQuery & {
      requestedBy?: string;
      correlationId?: string;
      reason?: string;
    },
  ): Promise<RevenuePredictionForecast> {
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
    request: RevenuePredictionBatchRequest,
  ): Promise<RevenuePredictionBatchResult> {
    const forecasts:
      RevenuePredictionForecast[] = [];

    const failures: Array<
      NonNullable<
        RevenuePredictionBatchResult["failures"]
      >[number]
    > = [];

    for (
      const context
      of request.contexts
    ) {
      try {
        const forecast =
          await this.runtime.generate({
            context,

            requestedBy:
              request.requestedBy,

            correlationId:
              request.correlationId,

            reason:
              "batch-generation",
          });

        forecasts.push(
          forecast,
        );
      } catch (error) {
        failures.push({
          periodStart:
            context.periodStart,

          periodEnd:
            context.periodEnd,

          code:
            "REVENUE_PREDICTION_FAILED",

          message:
            error instanceof Error
              ? error.message
              : "Unknown revenue prediction failure.",
        });
      }
    }

    return {
      requested:
        request.contexts.length,

      succeeded:
        forecasts.length,

      failed:
        failures.length,

      forecasts,
      failures,
    };
  }

  async getHistory(
    query:
      RevenuePredictionHistoryQuery,
  ): Promise<
    readonly RevenuePredictionHistoryEntry[]
  > {
    return this.repository.findHistory(
      query,
    );
  }

  async deleteForecast(
    query: RevenuePredictionQuery,
  ): Promise<void> {
    await this.repository.deleteForecast(
      query,
    );
  }
}

export const createRevenuePredictionService = (
  dependencies:
    RevenuePredictionServiceDependencies,
): RevenuePredictionService =>
  new RevenuePredictionService(
    dependencies,
  );

