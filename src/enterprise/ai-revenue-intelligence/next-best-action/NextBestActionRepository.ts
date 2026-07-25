import type {
  NextBestActionHistoryQuery,
  NextBestActionPlan,
  NextBestActionQuery,
  NextBestActionRecommendation,
  NextBestActionStatusUpdate,
} from "./NextBestActionTypes";

export interface NextBestActionRepository {
  findLatestPlan(
    query: NextBestActionQuery,
  ): Promise<NextBestActionPlan | null>;

  findRecommendations(
    query: NextBestActionHistoryQuery,
  ): Promise<
    readonly NextBestActionRecommendation[]
  >;

  findRecommendationById(input: {
    tenantId: string;
    workspaceId?: string;
    opportunityId: string;
    recommendationId: string;
  }): Promise<
    NextBestActionRecommendation | null
  >;

  savePlan(
    plan: NextBestActionPlan,
  ): Promise<NextBestActionPlan>;

  saveRecommendations(
    recommendations:
      readonly NextBestActionRecommendation[],
  ): Promise<
    readonly NextBestActionRecommendation[]
  >;

  updateRecommendationStatus(
    update: NextBestActionStatusUpdate,
  ): Promise<NextBestActionRecommendation>;

  expireRecommendations(
    query: NextBestActionQuery,
    occurredAt: string,
  ): Promise<number>;

  deleteForOpportunity(
    query: NextBestActionQuery,
  ): Promise<void>;
}

export class NextBestActionRepositoryError
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
      "NextBestActionRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertNextBestActionRepository = (
  repository: NextBestActionRepository,
): NextBestActionRepository => {
  if (!repository) {
    throw new NextBestActionRepositoryError(
      "REPOSITORY_REQUIRED",
      "Next best action repository is required.",
    );
  }

  return repository;
};
