import {
  OrganizationMemoryContext,
  OrganizationMemoryRecordType,
  OrganizationMemoryStatus,
} from "../types/organizationMemoryTypes";
import {
  OrganizationMemoryRecord,
  OrganizationMemorySnapshot,
} from "../models/organizationMemoryModel";
import { OrganizationMemoryValidator } from "../utils/organizationMemoryValidator";

export class OrganizationMemoryEngine {
  private status: OrganizationMemoryStatus = "idle";
  private readonly validator = new OrganizationMemoryValidator();
  private readonly records = new Map<string, OrganizationMemoryRecord[]>();

  getStatus(): OrganizationMemoryStatus {
    return this.status;
  }

  record(
    context: OrganizationMemoryContext,
    type: OrganizationMemoryRecordType,
    title: string,
    description: string,
    tags: string[] = [],
  ): OrganizationMemoryRecord {
    this.status = "recording";

    if (!this.validator.validateContext(context)) {
      this.status = "failed";
      throw new Error("Invalid organization memory context.");
    }

    const memoryRecord: OrganizationMemoryRecord = {
      id: `${context.organizationId}-memory-${Date.now()}`,
      organizationId: context.organizationId,
      type,
      title,
      description,
      priority: context.priority,
      confidence: context.confidence,
      tags,
      createdAt: new Date(),
    };

    if (!this.validator.validateRecord(memoryRecord)) {
      this.status = "failed";
      throw new Error("Invalid organization memory record.");
    }

    const existing = this.records.get(context.organizationId) ?? [];
    this.records.set(context.organizationId, [...existing, memoryRecord]);

    this.status = "ready";

    return memoryRecord;
  }

  snapshot(organizationId: string): OrganizationMemorySnapshot {
    this.status = "retrieving";

    const snapshot: OrganizationMemorySnapshot = {
      organizationId,
      records: this.records.get(organizationId) ?? [],
      lastUpdated: new Date(),
    };

    if (!this.validator.validateSnapshot(snapshot)) {
      this.status = "failed";
      throw new Error("Invalid organization memory snapshot.");
    }

    this.status = "ready";

    return snapshot;
  }

  getRecords(
    organizationId: string,
  ): OrganizationMemoryRecord[] {
    return [...(this.records.get(organizationId) ?? [])];
  }

  findByType(
    organizationId: string,
    type: OrganizationMemoryRecordType,
  ): OrganizationMemoryRecord[] {
    return this.getRecords(organizationId).filter(
      (record) => record.type === type,
    );
  }

  search(
    organizationId: string,
    keyword: string,
  ): OrganizationMemoryRecord[] {
    const query = keyword.trim().toLowerCase();

    return this.getRecords(organizationId).filter((record) => {
      return (
        record.title.toLowerCase().includes(query) ||
        record.description.toLowerCase().includes(query) ||
        record.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    });
  }

  count(organizationId: string): number {
    return this.getRecords(organizationId).length;
  }

  clear(organizationId: string): void {
    this.records.delete(organizationId);
  }
}