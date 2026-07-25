import {
  OpportunityScore,
  OpportunityScoreHistoryEntry,
  OpportunityScoreHistoryQuery,
  OpportunityScoreQuery,
} from "./OpportunityScoringTypes";

export interface OpportunityScoringRepository {
  findLatest(
    query: OpportunityScoreQuery,
  ): Promise<OpportunityScore | null>;

  findHistory(
    query: OpportunityScoreHistoryQuery,
  ): Promise<readonly OpportunityScoreHistoryEntry[]>;

  save(score: OpportunityScore): Promise<OpportunityScore>;

  appendHistory(
    entry: OpportunityScoreHistoryEntry,
  ): Promise<OpportunityScoreHistoryEntry>;

  deleteForOpportunity(
    query: OpportunityScoreQuery,
  ): Promise<void>;
}

export class OpportunityScoringRepositoryError extends Error {
  readonly code: string;
  readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    cause?: unknown,
  ) {
    super(message);

    this.name = "OpportunityScoringRepositoryError";
    this.code = code;
    this.cause = cause;
  }
}

export const assertOpportunityScoringRepository = (
  repository: OpportunityScoringRepository,
): OpportunityScoringRepository => {
  if (!repository) {
    throw new OpportunityScoringRepositoryError(
      "REPOSITORY_REQUIRED",
      "Opportunity scoring repository is required.",
    );
  }

  return repository;
};
