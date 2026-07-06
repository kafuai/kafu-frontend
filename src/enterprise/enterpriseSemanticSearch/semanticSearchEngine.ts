import { SemanticSearchDocument } from "./semanticSearchDocument";
import { SemanticSearchQuery } from "./semanticSearchQuery";
import { SemanticSearchResult } from "./semanticSearchResult";
import { calculateSemanticSimilarity } from "./semanticSimilarity";

export function executeSemanticSearch(
  query: SemanticSearchQuery,
  documents: readonly SemanticSearchDocument[],
): readonly SemanticSearchResult[] {
  return documents
    .map((document) => {
      const score = calculateSemanticSimilarity(
        query.text,
        `${document.title} ${document.content}`,
      );

      return {
        document,
        score,
        matchedTerms: query.text.split(/\s+/),
        explanation: "Semantic similarity score.",
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, query.limit);
}