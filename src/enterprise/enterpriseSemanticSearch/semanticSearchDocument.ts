import { SemanticSearchConfidence } from "./semanticSearchTypes";

export interface SemanticSearchDocument {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly sourceType: string;
  readonly sourceId: string;
  readonly tags: readonly string[];
  readonly confidence: SemanticSearchConfidence;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export function createSemanticSearchDocument(
  document: SemanticSearchDocument,
): SemanticSearchDocument {
  return {
    ...document,
    tags: [...document.tags],
  };
}