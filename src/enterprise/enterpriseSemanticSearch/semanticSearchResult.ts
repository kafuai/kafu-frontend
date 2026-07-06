import { SemanticSearchDocument } from "./semanticSearchDocument";

export interface SemanticSearchResult {
  readonly document: SemanticSearchDocument;
  readonly score: number;
  readonly matchedTerms: readonly string[];
  readonly explanation: string;
}

export function createSemanticSearchResult(
  result: SemanticSearchResult,
): SemanticSearchResult {
  return {
    ...result,
    matchedTerms: [...result.matchedTerms],
  };
}