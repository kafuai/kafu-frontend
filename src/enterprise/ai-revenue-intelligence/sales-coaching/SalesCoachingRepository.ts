import type {
  SalesCoachingHistoryEntry,
  SalesCoachingHistoryQuery,
  SalesCoachingPlan,
  SalesCoachingQuery,
  SalesCoachingRecommendation,
  SalesCoachingRecommendationStatus,
} from "./SalesCoachingTypes";

export interface SalesCoachingRecommendationStatusUpdate {
  tenantId: string;
  workspaceId?: string;
  opportunityId: string;
  recommendationId: string;

  status: SalesCoachingRecommendationStatus;
  actorId?: string;
  reason?: string;
  occurredAt: string;
}

export interface SalesCoachingRepository {
  findLatest(
    query: SalesCoachingQuery,
  ): Promise<SalesCoachingPlan | null>;

  findHistory(
    query: SalesCoachingHistoryQuery,
  ): Promise<readonly SalesCoachingHistoryEntry[]>;

  findRecommendation(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    recommendationId: string;
  }): Promise<SalesCoachingRecommendation | null>;

  savePlan(
    plan: SalesCoachingPlan,
  ): Promise<SalesCoachingPlan>;

  appendHistory(
    entry: SalesCoachingHistoryEntry,
  ): Promise<SalesCoachingHistoryEntry>;

  updateRecommendationStatus(
    update: SalesCoachingRecommendationStatusUpdate,
  ): Promise<SalesCoachingRecommendation>;

  deleteForOpportunity(
    query: SalesCoachingQuery,
  ): Promise<void>;
}

export class SalesCoachingRepositoryError
  extends Error {
  readonly code: string;
  readonly cause?: unknown;

  constructor(
    code: string,
    message: string,
    cause?: unknown,
  ) {
    super(message);

    this.name = "SalesCoachingRepositoryError";
    this.code = code;
    this.cause = cause;
  }
}

export const assertSalesCoachingRepository = (
  repository: SalesCoachingRepository,
): SalesCoachingRepository => {
  if (!repository) {
    throw new SalesCoachingRepositoryError(
      "REPOSITORY_REQUIRED",
      "Sales coaching repository is required.",
    );
  }

  return repository;
};
