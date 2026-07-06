import { SemanticSearchDocument } from "./semanticSearchDocument";
import { SemanticSearchQuery } from "./semanticSearchQuery";

export function applySemanticSearchFilters(
  documents: readonly SemanticSearchDocument[],
  query: SemanticSearchQuery,
): readonly SemanticSearchDocument[] {
  const filterEntries = Object.entries(query.filters);

  if (filterEntries.length === 0) {
    return documents;
  }

  return documents.filter((document) =>
    filterEntries.every(([key, value]) => {
      const candidate = document[key as keyof SemanticSearchDocument];

      if (Array.isArray(candidate)) {
        return candidate.includes(value);
      }

      return String(candidate) === value;
    }),
  );
}