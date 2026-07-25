import type {
  DealRiskAssessment,
  DealRiskHistoryEntry,
  DealRiskHistoryQuery,
  DealRiskQuery,
} from "./DealRiskTypes";

export interface DealRiskRepository {
  findLatest(
    query: DealRiskQuery,
  ): Promise<DealRiskAssessment | null>;

  findHistory(
    query: DealRiskHistoryQuery,
  ): Promise<
    readonly DealRiskHistoryEntry[]
  >;

  save(
    assessment: DealRiskAssessment,
  ): Promise<DealRiskAssessment>;

  appendHistory(
    entry: DealRiskHistoryEntry,
  ): Promise<DealRiskHistoryEntry>;

  deleteForOpportunity(
    query: DealRiskQuery,
  ): Promise<void>;
}

export class DealRiskRepositoryError
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
      "DealRiskRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertDealRiskRepository = (
  repository: DealRiskRepository,
): DealRiskRepository => {
  if (!repository) {
    throw new DealRiskRepositoryError(
      "REPOSITORY_REQUIRED",
      "Deal risk repository is required.",
    );
  }

  return repository;
};
