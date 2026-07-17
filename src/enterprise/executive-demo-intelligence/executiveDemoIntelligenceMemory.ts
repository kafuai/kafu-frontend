import type {
  ExecutiveDemoIntelligenceMemoryItem,
  ExecutiveDemoIntelligencePriority,
} from "./executiveDemoIntelligenceTypes";

export interface CreateExecutiveDemoMemoryInput {
  id: string;
  sessionId: string;
  organizationId: string;
  key: string;
  value: string;
  importance?: ExecutiveDemoIntelligencePriority;
  createdAt?: string;
}

export function createExecutiveDemoIntelligenceMemoryItem(
  input: CreateExecutiveDemoMemoryInput,
): ExecutiveDemoIntelligenceMemoryItem {
  return {
    id: input.id.trim(),
    sessionId: input.sessionId.trim(),
    organizationId: input.organizationId.trim(),
    key: input.key.trim(),
    value: input.value.trim(),
    importance: input.importance ?? "medium",
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function upsertExecutiveDemoIntelligenceMemory(
  memory: ExecutiveDemoIntelligenceMemoryItem[],
  item: ExecutiveDemoIntelligenceMemoryItem,
): ExecutiveDemoIntelligenceMemoryItem[] {
  const existingIndex = memory.findIndex(
    (entry) =>
      entry.sessionId === item.sessionId &&
      entry.organizationId === item.organizationId &&
      entry.key === item.key,
  );

  if (existingIndex === -1) {
    return [...memory, item];
  }

  return memory.map((entry, index) =>
    index === existingIndex ? item : entry,
  );
}

export function getExecutiveDemoSessionMemory(
  memory: ExecutiveDemoIntelligenceMemoryItem[],
  sessionId: string,
): ExecutiveDemoIntelligenceMemoryItem[] {
  return memory
    .filter((item) => item.sessionId === sessionId)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    );
}

export function getExecutiveDemoOrganizationMemory(
  memory: ExecutiveDemoIntelligenceMemoryItem[],
  organizationId: string,
): ExecutiveDemoIntelligenceMemoryItem[] {
  return memory
    .filter((item) => item.organizationId === organizationId)
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() -
        new Date(left.createdAt).getTime(),
    );
}
