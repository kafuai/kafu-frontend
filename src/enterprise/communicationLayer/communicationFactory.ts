import type {
  CommunicationConversation,
  CommunicationMessage,
  CommunicationParticipant,
} from "./communicationTypes";

export function createCommunicationConversation(input: {
  readonly id: string;
  readonly companyId: string;
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly createdBy: string;
  readonly channel: CommunicationConversation["channel"];
  readonly subject?: string;
  readonly participants?: readonly CommunicationParticipant[];
  readonly status?: CommunicationConversation["status"];
  readonly priority?: CommunicationConversation["priority"];
  readonly tags?: readonly string[];
  readonly createdAt?: string;
  readonly externalReferenceId?: string;
}): CommunicationConversation {
  const createdAt = input.createdAt ?? new Date().toISOString();

  return {
    id: input.id,
    subject: input.subject?.trim() || undefined,
    channel: input.channel,
    status: input.status ?? "active",
    priority: input.priority ?? "normal",
    participants: input.participants ?? [],
    externalReferenceId: input.externalReferenceId,
    lastMessageAt: undefined,
    metadata: {
      companyId: input.companyId,
      tenantId: input.tenantId ?? input.companyId,
      organizationId: input.organizationId ?? input.companyId,
      createdAt,
      updatedAt: createdAt,
      createdBy: input.createdBy,
      tags: input.tags ?? [],
    },
  };
}

export function createCommunicationMessage(input: {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly channel: CommunicationMessage["channel"];
  readonly direction: CommunicationMessage["direction"];
  readonly type?: CommunicationMessage["type"];
  readonly content: string;
  readonly deliveryStatus?: CommunicationMessage["deliveryStatus"];
  readonly createdAt?: string;
  readonly replyToMessageId?: string;
  readonly externalMessageId?: string;
}): CommunicationMessage {
  const createdAt = input.createdAt ?? new Date().toISOString();

  if (!input.content.trim() && input.type !== "event") {
    throw new Error("Communication message content is required.");
  }

  return {
    id: input.id,
    conversationId: input.conversationId,
    senderId: input.senderId,
    channel: input.channel,
    direction: input.direction,
    type: input.type ?? "text",
    content: input.content.trim(),
    deliveryStatus: input.deliveryStatus ?? "queued",
    createdAt,
    updatedAt: createdAt,
    replyToMessageId: input.replyToMessageId,
    externalMessageId: input.externalMessageId,
  };
}

export function touchCommunicationConversation(
  conversation: CommunicationConversation,
  lastMessageAt: string,
): CommunicationConversation {
  return {
    ...conversation,
    lastMessageAt,
    metadata: {
      ...conversation.metadata,
      updatedAt: lastMessageAt,
    },
  };
}
