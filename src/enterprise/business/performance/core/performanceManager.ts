import { PerformanceRecord } from "../models/performanceModel";
import { PerformanceRecordInput } from "../types/performanceTypes";
import { PerformanceValidator } from "../utils/performanceValidator";

export class PerformanceManager {
  private readonly validator = new PerformanceValidator();
  private readonly records = new Map<string, PerformanceRecord>();

  record(input: PerformanceRecordInput): PerformanceRecord {
    if (!this.validator.validateRecord(input)) {
      throw new Error("Invalid performance record.");
    }

    const record: PerformanceRecord = {
      id: `performance-${Date.now()}`,
      ...input,
      createdAt: Date.now(),
    };

    this.records.set(record.id, record);

    return record;
  }

  list(): PerformanceRecord[] {
    return Array.from(this.records.values());
  }

  get(id: string): PerformanceRecord | undefined {
    return this.records.get(id);
  }

  count(): number {
    return this.records.size;
  }
}