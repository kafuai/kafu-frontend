import { SemanticSearchResult } from "./semanticSearchResult";

export function rankSemanticSearchResults(
  results: readonly SemanticSearchResult[],
): readonly SemanticSearchResult[] {
  return [...results].sort((a, b) => b.score - a.score);
}