import type { ConversationMessage } from "./conversationMessage";

export interface ConversationMemoryEntry {
  readonly id: string;
  readonly conversationId: string;
  readonly sourceMessageId: string;
  readonly content: string;
  readonly importance: "low" | "medium" | "high" | "critical";
  readonly createdAt: string;
}

export interface ConversationMemory {
  readonly entries: readonly ConversationMemoryEntry[];
}

export function createConversationMemory(
  entries: readonly ConversationMemoryEntry[] = [],
): ConversationMemory {
  return {
    entries,
  };
}

export function rememberConversationMessage(input: {
  readonly message: ConversationMessage;
  readonly importance?: ConversationMemoryEntry["importance"];
  readonly createdAt?: string;
}): ConversationMemoryEntry {
  return {
    id: `${input.message.id}-memory`,
    conversationId: input.message.conversationId,
    sourceMessageId: input.message.id,
    content: input.message.content,
    importance: input.importance ?? "medium",
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}

export function addConversationMemoryEntry(
  memory: ConversationMemory,
  entry: ConversationMemoryEntry,
): ConversationMemory {
  const exists = memory.entries.some((item) => item.id === entry.id);

  if (exists) {
    return memory;
  }

  return {
    entries: [...memory.entries, entry],
  };
}

export function listConversationMemory(
  memory: ConversationMemory,
  conversationId: string,
): readonly ConversationMemoryEntry[] {
  return memory.entries.filter(
    (entry) => entry.conversationId === conversationId,
  );
}