import { SemanticSearchContext } from "./semanticSearchTypes";

export interface SemanticSearchSession {
  readonly id: string;
  readonly queryId: string;
  readonly context: SemanticSearchContext;
  readonly resultIds: readonly string[];
  readonly startedAt: string;
  readonly completedAt?: string;
}

export function createSemanticSearchSession(
  session: SemanticSearchSession,
): SemanticSearchSession {
  return {
    ...session,
    resultIds: [...session.resultIds],
  };
}