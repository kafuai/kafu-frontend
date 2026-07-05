import type { OperationalComplianceRecord } from "./operationalCompliance";

export class OperationalComplianceRegistry {
  private readonly records = new Map<string, OperationalComplianceRecord>();

  register(record: OperationalComplianceRecord): void {
    this.records.set(record.id, record);
  }

  getById(id: string): OperationalComplianceRecord | undefined {
    return this.records.get(id);
  }

  list(): readonly OperationalComplianceRecord[] {
    return [...this.records.values()];
  }

  clear(): void {
    this.records.clear();
  }
}