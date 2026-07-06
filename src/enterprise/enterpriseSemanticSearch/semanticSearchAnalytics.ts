import { SemanticSearchSession } from "./semanticSearchSession";

export interface SemanticSearchAnalytics {
  readonly totalSearches: number;
  readonly averageResultsPerSearch: number;
  readonly averageExecutionTimeMs: number;
}

export function calculateSemanticSearchAnalytics(
  sessions: readonly SemanticSearchSession[],
): SemanticSearchAnalytics {
  const totalResults = sessions.reduce(
    (sum, session) => sum + session.resultIds.length,
    0,
  );

  return {
    totalSearches: sessions.length,
    averageResultsPerSearch:
      sessions.length === 0 ? 0 : totalResults / sessions.length,
    averageExecutionTimeMs: 0,
  };
}