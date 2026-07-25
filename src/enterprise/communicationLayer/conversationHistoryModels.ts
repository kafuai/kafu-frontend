export type CommunicationHistoryEntryType =
  | "conversation_created"
  | "conversation_updated"
  | "participant_added"
  | "participant_updated"
  | "participant_removed"
  | "message_created"
  | "message_sent"
  | "message_delivered"
  | "message_read"
  | "message_failed"
  | "message_deleted"
  | "attachment_created"
  | "attachment_updated"
  | "presence_updated"
  | "notification_created"
  | "notification_dispatched"
  | "notification_read"
  | "system_event";

export interface CommunicationHistoryEntry {
  readonly id: string;
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly conversationId: string;
  readonly entryType: CommunicationHistoryEntryType;
  readonly actorId?: string;
  readonly participantId?: string;
  readonly messageId?: string;
  readonly attachmentId?: string;
  readonly notificationId?: string;
  readonly summary: string;
  readonly payload: Readonly<Record<string, unknown>>;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly occurredAt: string;
  readonly createdAt: string;
}

export interface CreateCommunicationHistoryEntryInput {
  readonly id: string;
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly conversationId: string;
  readonly entryType: CommunicationHistoryEntryType;
  readonly actorId?: string;
  readonly participantId?: string;
  readonly messageId?: string;
  readonly attachmentId?: string;
  readonly notificationId?: string;
  readonly summary: string;
  readonly payload?: Readonly<Record<string, unknown>>;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly occurredAt?: string;
}

export interface CommunicationConversationHistory {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly conversationId: string;
  readonly entries: readonly CommunicationHistoryEntry[];
  readonly firstActivityAt?: string;
  readonly lastActivityAt?: string;
  readonly totalEntries: number;
}

export function createCommunicationHistoryEntry(
  input: CreateCommunicationHistoryEntryInput,
): CommunicationHistoryEntry {
  if (!input.id.trim()) {
    throw new Error(
      "Communication history entry id is required.",
    );
  }

  if (!input.companyId.trim()) {
    throw new Error(
      "Communication history company id is required.",
    );
  }

  if (!input.tenantId.trim()) {
    throw new Error(
      "Communication history tenant id is required.",
    );
  }

  if (!input.organizationId.trim()) {
    throw new Error(
      "Communication history organization id is required.",
    );
  }

  if (!input.conversationId.trim()) {
    throw new Error(
      "Communication history conversation id is required.",
    );
  }

  if (!input.summary.trim()) {
    throw new Error(
      "Communication history summary is required.",
    );
  }

  const occurredAt =
    input.occurredAt ?? new Date().toISOString();

  return {
    ...input,
    payload: input.payload ?? {},
    occurredAt,
    createdAt: new Date().toISOString(),
  };
}

export function buildCommunicationConversationHistory(
  entries: readonly CommunicationHistoryEntry[],
): CommunicationConversationHistory | null {
  if (entries.length === 0) {
    return null;
  }

  const sortedEntries = [...entries].sort(
    (left, right) =>
      new Date(left.occurredAt).getTime() -
      new Date(right.occurredAt).getTime(),
  );

  const first = sortedEntries[0];
  const last = sortedEntries[sortedEntries.length - 1];

  return {
    companyId: first.companyId,
    tenantId: first.tenantId,
    organizationId: first.organizationId,
    conversationId: first.conversationId,
    entries: sortedEntries,
    firstActivityAt: first.occurredAt,
    lastActivityAt: last.occurredAt,
    totalEntries: sortedEntries.length,
  };
}
