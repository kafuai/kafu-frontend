import type { OperationalAssuranceRecord } from "./operationalAssurance";

export class OperationalAssuranceRegistry {
  private readonly records = new Map<string, OperationalAssuranceRecord>();

  register(record: OperationalAssuranceRecord): void {
    this.records.set(record.id, record);
  }

  getById(id: string): OperationalAssuranceRecord | undefined {
    return this.records.get(id);
  }

  list(): readonly OperationalAssuranceRecord[] {
    return [...this.records.values()];
  }

  clear(): void {
    this.records.clear();
  }
}