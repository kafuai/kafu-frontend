import type { EnterpriseMemoryRecord } from "./memoryTypes";

export interface EnterpriseMemoryContext {
  readonly tenantId: string;
  readonly organizationId?: string;
  readonly userId?: string;
  readonly conversationId?: string;
  readonly records: readonly EnterpriseMemoryRecord[];
}

export function buildEnterpriseMemoryContext(
  records: readonly EnterpriseMemoryRecord[],
): EnterpriseMemoryContext {
  const first = records[0];

  return {
    tenantId: first?.metadata.tenantId ?? "",
    organizationId: first?.metadata.organizationId,
    userId: first?.metadata.userId,
    conversationId: first?.metadata.conversationId,
    records,
  };
}