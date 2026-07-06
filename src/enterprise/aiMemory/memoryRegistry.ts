import type { EnterpriseMemoryRecord } from "./memoryTypes";

export class EnterpriseMemoryRegistry {
  private readonly records = new Map<string, EnterpriseMemoryRecord>();

  register(record: EnterpriseMemoryRecord): void {
    this.records.set(record.id, record);
  }

  registerMany(records: readonly EnterpriseMemoryRecord[]): void {
    records.forEach((record) => this.register(record));
  }

  get(id: string): EnterpriseMemoryRecord | undefined {
    return this.records.get(id);
  }

  exists(id: string): boolean {
    return this.records.has(id);
  }

  remove(id: string): boolean {
    return this.records.delete(id);
  }

  clear(): void {
    this.records.clear();
  }

  list(): readonly EnterpriseMemoryRecord[] {
    return [...this.records.values()];
  }

  size(): number {
    return this.records.size;
  }
}