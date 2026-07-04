import { AITransparencyRecord } from "./aiTransparencyRecord";

export class AITransparencyRegistry {
  private readonly records = new Map<string, AITransparencyRecord>();

  register(record: AITransparencyRecord): void {
    this.records.set(record.id, record);
  }

  get(id: string): AITransparencyRecord | undefined {
    return this.records.get(id);
  }

  list(): AITransparencyRecord[] {
    return [...this.records.values()];
  }

  listByOrganization(organizationId: string): AITransparencyRecord[] {
    return this.list().filter(
      record => record.organizationId === organizationId,
    );
  }

  listByModel(modelId: string): AITransparencyRecord[] {
    return this.list().filter(record => record.modelId === modelId);
  }

  remove(id: string): boolean {
    return this.records.delete(id);
  }

  clear(): void {
    this.records.clear();
  }
}