import { KPIRecord } from "../models/kpiModel";
import { KPIInput } from "../types/kpiTypes";
import { KPIValidator } from "../utils/kpiValidator";

export class KPIManager {
  private readonly validator = new KPIValidator();
  private readonly records = new Map<string, KPIRecord>();

  create(input: KPIInput): KPIRecord {
    if (!this.validator.validate(input)) {
      throw new Error("Invalid KPI input.");
    }

    const achievement =
      input.target === 0
        ? 0
        : (input.actual / input.target) * 100;

    const record: KPIRecord = {
      ...input,
      achievement,
      createdAt: Date.now(),
    };

    this.records.set(record.id, record);

    return record;
  }

  get(id: string): KPIRecord | undefined {
    return this.records.get(id);
  }

  list(): KPIRecord[] {
    return Array.from(this.records.values());
  }

  count(): number {
    return this.records.size;
  }
}