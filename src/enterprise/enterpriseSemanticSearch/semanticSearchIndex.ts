import { SemanticSearchDocument } from "./semanticSearchDocument";

export interface SemanticSearchIndexEntry {
  readonly term: string;
  readonly documentIds: readonly string[];
}

export class SemanticSearchIndex {
  private readonly index = new Map<string, Set<string>>();

  indexDocument(document: SemanticSearchDocument): void {
    const terms = `${document.title} ${document.content}`
      .toLowerCase()
      .split(/\s+/);

    for (const term of terms) {
      if (!this.index.has(term)) {
        this.index.set(term, new Set());
      }

      this.index.get(term)?.add(document.id);
    }
  }

  lookup(term: string): SemanticSearchIndexEntry {
    const ids = this.index.get(term.toLowerCase());

    return {
      term,
      documentIds: ids ? [...ids] : [],
    };
  }

  clear(): void {
    this.index.clear();
  }
}