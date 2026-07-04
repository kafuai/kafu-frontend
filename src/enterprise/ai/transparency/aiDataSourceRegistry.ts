import { AIDataSourceDisclosure } from "./aiDataSourceDisclosure";

export class AIDataSourceRegistry {
  private readonly sources = new Map<string, AIDataSourceDisclosure>();

  register(source: AIDataSourceDisclosure): void {
    this.sources.set(source.id, source);
  }

  get(id: string): AIDataSourceDisclosure | undefined {
    return this.sources.get(id);
  }

  list(): AIDataSourceDisclosure[] {
    return [...this.sources.values()];
  }

  listByTransparencyRecord(
    transparencyRecordId: string,
  ): AIDataSourceDisclosure[] {
    return this.list().filter(
      source => source.transparencyRecordId === transparencyRecordId,
    );
  }

  remove(id: string): boolean {
    return this.sources.delete(id);
  }

  clear(): void {
    this.sources.clear();
  }
}