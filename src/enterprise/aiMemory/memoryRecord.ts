import type {
  EnterpriseMemoryCategory,
  EnterpriseMemoryConfidence,
  EnterpriseMemoryPayload,
  EnterpriseMemoryRecord,
  EnterpriseMemoryRetentionPolicy,
  EnterpriseMemoryScope,
  EnterpriseMemorySecurityPolicy,
  EnterpriseMemorySource,
  EnterpriseMemoryStatus,
} from "./memoryTypes";

export interface CreateEnterpriseMemoryRecordInput {
  readonly id: string;
  readonly scope: EnterpriseMemoryScope;
  readonly category: EnterpriseMemoryCategory;
  readonly source: EnterpriseMemorySource;
  readonly payload: EnterpriseMemoryPayload;
  readonly tenantId: string;
  readonly organizationId?: string;
  readonly userId?: string;
  readonly conversationId?: string;
  readonly departmentId?: string;
  readonly tags?: readonly string[];
  readonly confidence?: EnterpriseMemoryConfidence;
  readonly status?: EnterpriseMemoryStatus;
  readonly retention?: Partial<EnterpriseMemoryRetentionPolicy>;
  readonly security?: Partial<EnterpriseMemorySecurityPolicy>;
  readonly createdAt?: string;
}

export function createEnterpriseMemoryRecord(
  input: CreateEnterpriseMemoryRecordInput,
): EnterpriseMemoryRecord {
  const timestamp = input.createdAt ?? new Date().toISOString();

  return {
    id: input.id,
    scope: input.scope,
    category: input.category,
    status: input.status ?? "active",
    confidence: input.confidence ?? "medium",
    source: input.source,
    payload: input.payload,
    metadata: {
      tenantId: input.tenantId,
      organizationId: input.organizationId,
      userId: input.userId,
      conversationId: input.conversationId,
      departmentId: input.departmentId,
      tags: input.tags ?? [],
      createdAt: timestamp,
      updatedAt: timestamp,
      version: 1,
    },
    retention: {
      expiresAt: input.retention?.expiresAt,
      reviewAfter: input.retention?.reviewAfter,
      allowLearning: input.retention?.allowLearning ?? true,
      allowPersonalization: input.retention?.allowPersonalization ?? true,
      allowReasoningReuse: input.retention?.allowReasoningReuse ?? true,
    },
    security: {
      sensitivity: input.security?.sensitivity ?? "internal",
      accessRoles: input.security?.accessRoles ?? [],
      tenantIsolated: input.security?.tenantIsolated ?? true,
      auditRequired: input.security?.auditRequired ?? true,
    },
  };
}

export function updateEnterpriseMemoryRecord(
  record: EnterpriseMemoryRecord,
  updates: Partial<
    Pick<
      EnterpriseMemoryRecord,
      "status" | "confidence" | "payload" | "retention" | "security"
    >
  >,
): EnterpriseMemoryRecord {
  return {
    ...record,
    ...updates,
    metadata: {
      ...record.metadata,
      updatedAt: new Date().toISOString(),
      version: record.metadata.version + 1,
    },
  };
}