import type {
  RevenuePredictionForecast,
  RevenuePredictionHistoryEntry,
  RevenuePredictionHistoryQuery,
  RevenuePredictionQuery,
} from "./RevenuePredictionTypes";

export interface RevenuePredictionRepository {
  findLatest(
    query: RevenuePredictionQuery,
  ): Promise<
    RevenuePredictionForecast | null
  >;

  findHistory(
    query: RevenuePredictionHistoryQuery,
  ): Promise<
    readonly RevenuePredictionHistoryEntry[]
  >;

  saveForecast(
    forecast: RevenuePredictionForecast,
  ): Promise<RevenuePredictionForecast>;

  appendHistory(
    entry: RevenuePredictionHistoryEntry,
  ): Promise<RevenuePredictionHistoryEntry>;

  deleteForecast(
    query: RevenuePredictionQuery,
  ): Promise<void>;
}

export class RevenuePredictionRepositoryError
  extends Error {
  readonly code: string;
  readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    cause?: unknown,
  ) {
    super(message);

    this.name =
      "RevenuePredictionRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertRevenuePredictionRepository = (
  repository:
    RevenuePredictionRepository,
): RevenuePredictionRepository => {
  if (!repository) {
    throw new RevenuePredictionRepositoryError(
      "REPOSITORY_REQUIRED",
      "Revenue prediction repository is required.",
    );
  }

  return repository;
};
