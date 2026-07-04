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

    const now = Date.now();

    const memoryRecord: OrganizationMemoryRecord = {
      id: `${context.organizationId}-mem-${now}`,
      organizationId: context.organizationId,
      type,
      title,
      description,
      priority: context.priority,
      confidence: context.confidence,
      tags,
      createdAt: now,
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

    const records = this.records.get(organizationId) ?? [];

    const snapshot: OrganizationMemorySnapshot = {
      organizationId,
      records,
      lastUpdated: Date.now(),
    };

    if (!this.validator.validateSnapshot(snapshot)) {
      this.status = "failed";
      throw new Error("Invalid organization memory snapshot.");
    }

    this.status = "ready";

    return snapshot;
  }

  getRecords(organizationId: string): OrganizationMemoryRecord[] {
    return [...(this.records.get(organizationId) ?? [])];
  }

  findByType(
    organizationId: string,
    type: OrganizationMemoryRecordType,
  ): OrganizationMemoryRecord[] {
    return this.getRecords(organizationId).filter(
      (r) => r.type === type,
    );
  }

  // 🔥 IMPROVED SEARCH (simple scoring instead of raw includes)
  search(
    organizationId: string,
    keyword: string,
  ): OrganizationMemoryRecord[] {
    const query = keyword.toLowerCase().trim();

    return this.getRecords(organizationId)
      .map((record) => {
        let score = 0;

        if (record.title.toLowerCase().includes(query)) score += 3;
        if (record.description.toLowerCase().includes(query)) score += 2;
        if (record.tags.some(t => t.toLowerCase().includes(query))) score += 1;

        return { record, score };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.record);
  }

  count(organizationId: string): number {
    return this.getRecords(organizationId).length;
  }

  clear(organizationId: string): void {
    this.records.delete(organizationId);
  }
}