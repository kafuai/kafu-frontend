import {
  SemanticSearchDocument,
  createSemanticSearchDocument,
} from "./semanticSearchDocument";

export class SemanticDocumentRegistry {
  private readonly documents = new Map<string, SemanticSearchDocument>();

  register(document: SemanticSearchDocument): void {
    this.documents.set(
      document.id,
      createSemanticSearchDocument(document),
    );
  }

  get(id: string): SemanticSearchDocument | undefined {
    return this.documents.get(id);
  }

  getAll(): readonly SemanticSearchDocument[] {
    return [...this.documents.values()];
  }

  remove(id: string): boolean {
    return this.documents.delete(id);
  }

  clear(): void {
    this.documents.clear();
  }

  count(): number {
    return this.documents.size;
  }
}