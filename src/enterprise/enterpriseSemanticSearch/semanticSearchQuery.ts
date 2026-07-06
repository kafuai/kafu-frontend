import { SemanticSearchContext } from "./semanticSearchTypes";

export interface SemanticSearchQuery {
  readonly id: string;
  readonly text: string;
  readonly context: SemanticSearchContext;
  readonly filters: Readonly<Record<string, string>>;
  readonly limit: number;
}

export function createSemanticSearchQuery(
  query: SemanticSearchQuery,
): SemanticSearchQuery {
  return {
    ...query,
    filters: { ...query.filters },
  };
}