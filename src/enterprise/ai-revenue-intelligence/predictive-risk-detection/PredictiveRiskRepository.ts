import type {
  PredictiveRiskAssessment,
  PredictiveRiskHistoryEntry,
  PredictiveRiskHistoryQuery,
  PredictiveRiskQuery,
} from "./PredictiveRiskTypes";

export interface PredictiveRiskRepository {
  findLatest(
    query: PredictiveRiskQuery,
  ): Promise<
    PredictiveRiskAssessment | null
  >;

  findHistory(
    query:
      PredictiveRiskHistoryQuery,
  ): Promise<
    readonly PredictiveRiskHistoryEntry[]
  >;

  saveAssessment(
    assessment:
      PredictiveRiskAssessment,
  ): Promise<PredictiveRiskAssessment>;

  appendHistory(
    entry:
      PredictiveRiskHistoryEntry,
  ): Promise<PredictiveRiskHistoryEntry>;

  deleteAssessment(
    query: PredictiveRiskQuery,
  ): Promise<void>;
}

export class PredictiveRiskRepositoryError
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
      "PredictiveRiskRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertPredictiveRiskRepository = (
  repository:
    PredictiveRiskRepository,
): PredictiveRiskRepository => {
  if (!repository) {
    throw new PredictiveRiskRepositoryError(
      "REPOSITORY_REQUIRED",
      "Predictive risk repository is required.",
    );
  }

  return repository;
};
