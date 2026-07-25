import type {
  ExecutiveAIInsightBriefing,
  ExecutiveAIInsightHistoryEntry,
  ExecutiveAIInsightHistoryQuery,
  ExecutiveAIInsightQuery,
} from "./ExecutiveAIInsightTypes";

export interface ExecutiveAIInsightRepository {
  findLatest(
    query:
      ExecutiveAIInsightQuery,
  ): Promise<
    ExecutiveAIInsightBriefing | null
  >;

  findHistory(
    query:
      ExecutiveAIInsightHistoryQuery,
  ): Promise<
    readonly ExecutiveAIInsightHistoryEntry[]
  >;

  saveBriefing(
    briefing:
      ExecutiveAIInsightBriefing,
  ): Promise<ExecutiveAIInsightBriefing>;

  appendHistory(
    entry:
      ExecutiveAIInsightHistoryEntry,
  ): Promise<ExecutiveAIInsightHistoryEntry>;

  deleteBriefing(
    query:
      ExecutiveAIInsightQuery,
  ): Promise<void>;
}

export class ExecutiveAIInsightRepositoryError
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
      "ExecutiveAIInsightRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertExecutiveAIInsightRepository = (
  repository:
    ExecutiveAIInsightRepository,
): ExecutiveAIInsightRepository => {
  if (!repository) {
    throw new ExecutiveAIInsightRepositoryError(
      "REPOSITORY_REQUIRED",
      "Executive AI insight repository is required.",
    );
  }

  return repository;
};
