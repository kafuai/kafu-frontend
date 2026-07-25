import type {
  PipelineHealthAssessment,
  PipelineHealthHistoryEntry,
  PipelineHealthHistoryQuery,
  PipelineHealthQuery,
} from "./PipelineHealthTypes";

export interface PipelineHealthRepository {
  findLatest(
    query: PipelineHealthQuery,
  ): Promise<
    PipelineHealthAssessment | null
  >;

  findHistory(
    query: PipelineHealthHistoryQuery,
  ): Promise<
    readonly PipelineHealthHistoryEntry[]
  >;

  save(
    assessment:
      PipelineHealthAssessment,
  ): Promise<PipelineHealthAssessment>;

  appendHistory(
    entry: PipelineHealthHistoryEntry,
  ): Promise<PipelineHealthHistoryEntry>;

  deleteForPipeline(
    query: PipelineHealthQuery,
  ): Promise<void>;
}

export class PipelineHealthRepositoryError
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
      "PipelineHealthRepositoryError";

    this.code = code;
    this.cause = cause;
  }
}

export const assertPipelineHealthRepository = (
  repository: PipelineHealthRepository,
): PipelineHealthRepository => {
  if (!repository) {
    throw new PipelineHealthRepositoryError(
      "REPOSITORY_REQUIRED",
      "Pipeline health repository is required.",
    );
  }

  return repository;
};
