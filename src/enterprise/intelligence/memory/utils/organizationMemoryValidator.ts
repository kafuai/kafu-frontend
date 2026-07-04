import {
  OrganizationMemoryRecord,
  OrganizationMemorySnapshot,
} from "../models/organizationMemoryModel";
import { OrganizationMemoryContext } from "../types/organizationMemoryTypes";

export class OrganizationMemoryValidator {
  validateContext(context: OrganizationMemoryContext): boolean {
    return Boolean(
      context.organizationId &&
        context.domain &&
        context.priority &&
        context.confidence,
    );
  }

  validateRecord(record: OrganizationMemoryRecord): boolean {
    return Boolean(
      record.id &&
        record.organizationId &&
        record.type &&
        record.title &&
        record.description &&
        record.priority &&
        record.confidence &&
        Array.isArray(record.tags) &&
        record.createdAt,
    );
  }

  validateSnapshot(snapshot: OrganizationMemorySnapshot): boolean {
    return Boolean(
      snapshot.organizationId &&
        Array.isArray(snapshot.records) &&
        snapshot.lastUpdated,
    );
  }
}