import type {
  RevenueIntelligenceHistoryQuery,
  RevenueIntelligenceQuery,
  RevenueIntelligenceResult,
} from "./RevenueIntelligenceTypes";

export interface RevenueIntelligenceRepository {
  findLatest(
    query: RevenueIntelligenceQuery,
  ): Promise<
    RevenueIntelligenceResult | null
  >;

  findHistory(
    query:
      RevenueIntelligenceHistoryQuery,
  ): Promise<
    readonly RevenueIntelligenceResult[]
  >;

  save(
    result: RevenueIntelligenceResult,
  ): Promise<RevenueIntelligenceResult>;

  delete(
    query: RevenueIntelligenceQuery,
  ): Promise<void>;
}

export class RevenueIntelligenceRepositoryError
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
      "RevenueIntelligenceRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertRevenueIntelligenceRepository = (
  repository:
    RevenueIntelligenceRepository,
): RevenueIntelligenceRepository => {
  if (!repository) {
    throw new RevenueIntelligenceRepositoryError(
      "REPOSITORY_REQUIRED",
      "Revenue intelligence repository is required.",
    );
  }

  return repository;
};
