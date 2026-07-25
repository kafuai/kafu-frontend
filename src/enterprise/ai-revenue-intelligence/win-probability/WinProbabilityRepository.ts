import type {
  WinProbabilityHistoryEntry,
  WinProbabilityHistoryQuery,
  WinProbabilityPrediction,
  WinProbabilityQuery,
} from "./WinProbabilityTypes";

export interface WinProbabilityRepository {
  findLatest(
    query: WinProbabilityQuery,
  ): Promise<WinProbabilityPrediction | null>;

  findHistory(
    query: WinProbabilityHistoryQuery,
  ): Promise<readonly WinProbabilityHistoryEntry[]>;

  save(
    prediction: WinProbabilityPrediction,
  ): Promise<WinProbabilityPrediction>;

  appendHistory(
    entry: WinProbabilityHistoryEntry,
  ): Promise<WinProbabilityHistoryEntry>;

  deleteForOpportunity(
    query: WinProbabilityQuery,
  ): Promise<void>;
}

export class WinProbabilityRepositoryError extends Error {
  readonly code: string;
  readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    cause?: unknown,
  ) {
    super(message);

    this.name = "WinProbabilityRepositoryError";
    this.code = code;
    this.cause = cause;
  }
}

export const assertWinProbabilityRepository = (
  repository: WinProbabilityRepository,
): WinProbabilityRepository => {
  if (!repository) {
    throw new WinProbabilityRepositoryError(
      "REPOSITORY_REQUIRED",
      "Win probability repository is required.",
    );
  }

  return repository;
};
