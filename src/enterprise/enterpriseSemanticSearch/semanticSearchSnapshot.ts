import { SemanticSearchDocument } from "./semanticSearchDocument";

export interface SemanticSearchSnapshot {
  readonly id: string;
  readonly createdAt: string;
  readonly documentCount: number;
  readonly documents: readonly SemanticSearchDocument[];
}

export function createSemanticSearchSnapshot(
  id: string,
  documents: readonly SemanticSearchDocument[],
): SemanticSearchSnapshot {
  return {
    id,
    createdAt: new Date().toISOString(),
    documentCount: documents.length,
    documents: [...documents],
  };
}