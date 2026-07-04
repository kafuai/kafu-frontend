import {
  OrganizationMemoryRecord,
  OrganizationMemorySnapshot,
} from "../models/organizationMemoryModel";
import { OrganizationMemoryContext } from "../types/organizationMemoryTypes";

export class OrganizationMemoryValidator {
  validateContext(context: OrganizationMemoryContext): boolean {
    return (
      !!context.organizationId &&
      !!context.domain &&
      !!context.priority &&
      !!context.confidence
    );
  }

  validateRecord(record: OrganizationMemoryRecord): boolean {
    if (!record.organizationId || !record.id) return false;
    if (!record.title || !record.description) return false;
    if (!Array.isArray(record.tags)) return false;
    if (typeof record.createdAt !== "number") return false;

    return true;
  }

  validateSnapshot(snapshot: OrganizationMemorySnapshot): boolean {
    return (
      !!snapshot.organizationId &&
      Array.isArray(snapshot.records) &&
      typeof snapshot.lastUpdated === "number"
    );
  }
}