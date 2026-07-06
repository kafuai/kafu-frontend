import type { EnterpriseMemoryRecord } from "./memoryTypes";

export interface EnterpriseMemoryAccessContext {
  readonly tenantId: string;
  readonly roles: readonly string[];
  readonly allowRestricted?: boolean;
}

export function canAccessEnterpriseMemory(
  record: EnterpriseMemoryRecord,
  context: EnterpriseMemoryAccessContext,
): boolean {
  if (record.security.tenantIsolated && record.metadata.tenantId !== context.tenantId) {
    return false;
  }

  if (record.security.sensitivity === "restricted" && !context.allowRestricted) {
    return false;
  }

  if (record.security.accessRoles.length === 0) {
    return true;
  }

  return record.security.accessRoles.some((role) => context.roles.includes(role));
}

export function filterAccessibleEnterpriseMemory(
  records: readonly EnterpriseMemoryRecord[],
  context: EnterpriseMemoryAccessContext,
): EnterpriseMemoryRecord[] {
  return records.filter((record) => canAccessEnterpriseMemory(record, context));
}