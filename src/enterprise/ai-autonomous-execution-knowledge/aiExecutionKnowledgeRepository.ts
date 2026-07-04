import { AIExecutionKnowledgeRecord } from "./aiExecutionKnowledgeRecord";

export class AIExecutionKnowledgeRepository {
  private readonly records = new Map<string, AIExecutionKnowledgeRecord>();

  add(record: AIExecutionKnowledgeRecord): AIExecutionKnowledgeRecord {
    this.records.set(record.id, record);
    return record;
  }

  upsert(record: AIExecutionKnowledgeRecord): AIExecutionKnowledgeRecord {
    this.records.set(record.id, record);
    return record;
  }

  get(id: string): AIExecutionKnowledgeRecord | undefined {
    return this.records.get(id);
  }

  require(id: string): AIExecutionKnowledgeRecord {
    const record = this.get(id);

    if (!record) {
      throw new Error(`Knowledge record not found: ${id}`);
    }

    return record;
  }

  remove(id: string): boolean {
    return this.records.delete(id);
  }

  list(): AIExecutionKnowledgeRecord[] {
    return [...this.records.values()];
  }

  findByType(type: AIExecutionKnowledgeRecord["type"]): AIExecutionKnowledgeRecord[] {
    return this.list().filter((record) => record.type === type);
  }

  findByTag(tag: string): AIExecutionKnowledgeRecord[] {
    return this.list().filter((record) => record.tags.includes(tag));
  }

  findByScope(scope: AIExecutionKnowledgeRecord["scope"]): AIExecutionKnowledgeRecord[] {
    return this.list().filter((record) => record.scope === scope);
  }

  clear(): void {
    this.records.clear();
  }

  size(): number {
    return this.records.size;
  }
}