import type {
  EnterpriseMemoryCategory,
  EnterpriseMemoryRecord,
  EnterpriseMemoryScope,
} from "./memoryTypes";

export interface EnterpriseMemoryQuery {
  readonly tenantId: string;
  readonly scope?: EnterpriseMemoryScope;
  readonly category?: EnterpriseMemoryCategory;
  readonly userId?: string;
  readonly conversationId?: string;
  readonly tag?: string;
}

export function filterEnterpriseMemory(
  records: readonly EnterpriseMemoryRecord[],
  query: EnterpriseMemoryQuery,
): EnterpriseMemoryRecord[] {
  return records.filter((record) => {
    if (record.metadata.tenantId !== query.tenantId) {
      return false;
    }

    if (query.scope && record.scope !== query.scope) {
      return false;
    }

    if (query.category && record.category !== query.category) {
      return false;
    }

    if (
      query.userId &&
      record.metadata.userId !== query.userId
    ) {
      return false;
    }

    if (
      query.conversationId &&
      record.metadata.conversationId !== query.conversationId
    ) {
      return false;
    }

    if (
      query.tag &&
      !record.metadata.tags.includes(query.tag)
    ) {
      return false;
    }

    return true;
  });
}