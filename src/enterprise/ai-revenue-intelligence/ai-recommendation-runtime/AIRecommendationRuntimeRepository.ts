import type {
  AIRecommendation,
  AIRecommendationHistoryEntry,
  AIRecommendationQuery,
  AIRecommendationStatus,
} from "./AIRecommendationRuntimeTypes";

export interface AIRecommendationRepository {
  findById(
    tenantId: string,
    recommendationId: string,
    workspaceId?: string,
  ): Promise<AIRecommendation | null>;

  findMany(
    query: AIRecommendationQuery,
  ): Promise<
    readonly AIRecommendation[]
  >;

  findActiveByDeduplicationKeys(
    tenantId: string,
    deduplicationKeys:
      readonly string[],
    workspaceId?: string,
  ): Promise<
    readonly AIRecommendation[]
  >;

  saveMany(
    recommendations:
      readonly AIRecommendation[],
  ): Promise<
    readonly AIRecommendation[]
  >;

  updateStatus(
    tenantId: string,
    recommendationId: string,
    status: AIRecommendationStatus,
    changes:
      Partial<AIRecommendation>,
    workspaceId?: string,
  ): Promise<AIRecommendation>;

  appendHistory(
    entry:
      AIRecommendationHistoryEntry,
  ): Promise<AIRecommendationHistoryEntry>;

  expireDueRecommendations(
    tenantId: string,
    expiresBefore: string,
    workspaceId?: string,
  ): Promise<
    readonly AIRecommendation[]
  >;
}

export class AIRecommendationRepositoryError
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
      "AIRecommendationRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertAIRecommendationRepository = (
  repository:
    AIRecommendationRepository,
): AIRecommendationRepository => {
  if (!repository) {
    throw new AIRecommendationRepositoryError(
      "REPOSITORY_REQUIRED",
      "AI recommendation repository is required.",
    );
  }

  return repository;
};
