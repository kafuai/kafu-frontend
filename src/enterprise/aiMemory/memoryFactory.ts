import type {
  EnterpriseMemoryCategory,
  EnterpriseMemoryPayload,
  EnterpriseMemoryRecord,
  EnterpriseMemoryScope,
  EnterpriseMemorySource,
} from "./memoryTypes";
import { createEnterpriseMemoryRecord } from "./memoryRecord";

export interface EnterpriseMemoryFactoryInput {
  readonly id: string;
  readonly tenantId: string;
  readonly scope: EnterpriseMemoryScope;
  readonly category: EnterpriseMemoryCategory;
  readonly title: string;
  readonly content: string;
  readonly source: EnterpriseMemorySource;
  readonly organizationId?: string;
  readonly userId?: string;
  readonly conversationId?: string;
  readonly departmentId?: string;
  readonly summary?: string;
  readonly keywords?: readonly string[];
  readonly relatedEntityIds?: readonly string[];
  readonly tags?: readonly string[];
}

export function createEnterpriseMemoryFromContent(
  input: EnterpriseMemoryFactoryInput,
): EnterpriseMemoryRecord {
  const payload: EnterpriseMemoryPayload = {
    title: input.title,
    content: input.content,
    summary: input.summary,
    keywords: input.keywords ?? [],
    relatedEntityIds: input.relatedEntityIds ?? [],
  };

  return createEnterpriseMemoryRecord({
    id: input.id,
    tenantId: input.tenantId,
    organizationId: input.organizationId,
    userId: input.userId,
    conversationId: input.conversationId,
    departmentId: input.departmentId,
    scope: input.scope,
    category: input.category,
    source: input.source,
    payload,
    tags: input.tags,
  });
}

export function createUserPreferenceMemory(
  input: Omit<EnterpriseMemoryFactoryInput, "scope" | "category">,
): EnterpriseMemoryRecord {
  return createEnterpriseMemoryFromContent({
    ...input,
    scope: "user",
    category: "preference",
    tags: [...(input.tags ?? []), "user-preference"],
  });
}

export function createDecisionMemory(
  input: Omit<EnterpriseMemoryFactoryInput, "category">,
): EnterpriseMemoryRecord {
  return createEnterpriseMemoryFromContent({
    ...input,
    category: "decision",
    tags: [...(input.tags ?? []), "decision-memory"],
  });
}