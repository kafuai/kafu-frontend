import type {
  CommunicationDomainEvent,
} from "./domain/domainEvents";

import type {
  CreateCommunicationHistoryEntryInput,
  CommunicationHistoryEntryType,
} from "./conversationHistoryModels";

function resolveHistoryEntryType(
  event: CommunicationDomainEvent,
): CommunicationHistoryEntryType {
  switch (event.type) {
    case "conversation.created":
      return "conversation_created";

    case "conversation.updated":
    case "conversation.resolved":
    case "conversation.archived":
      return "conversation_updated";

    case "participant.added":
      return "participant_added";

    case "participant.updated":
      return "participant_updated";

    case "participant.removed":
      return "participant_removed";

    case "message.created":
    case "message.queued":
      return "message_created";

    case "message.sent":
      return "message_sent";

    case "message.delivered":
      return "message_delivered";

    case "message.read":
      return "message_read";

    case "message.failed":
      return "message_failed";

    case "message.deleted":
      return "message_deleted";

    case "attachment.created":
      return "attachment_created";

    case "attachment.processing":
    case "attachment.ready":
    case "attachment.failed":
    case "attachment.deleted":
      return "attachment_updated";

    case "channel.status_changed":
    default:
      return "system_event";
  }
}

function resolveConversationId(
  event: CommunicationDomainEvent,
): string {
  if (event.aggregateType === "conversation") {
    return event.aggregateId;
  }

  const payload = event.payload;

  if (
    payload &&
    typeof payload === "object" &&
    "conversationId" in payload &&
    typeof payload.conversationId === "string" &&
    payload.conversationId.trim()
  ) {
    return payload.conversationId;
  }

  throw new Error(
    `Communication event "${event.id}" does not contain a conversation id.`,
  );
}

function readPayloadString(
  payload: unknown,
  key: string,
): string | undefined {
  if (
    !payload ||
    typeof payload !== "object" ||
    !(key in payload)
  ) {
    return undefined;
  }

  const value =
    (payload as Record<string, unknown>)[key];

  return typeof value === "string"
    ? value
    : undefined;
}

export function mapCommunicationDomainEventToHistory(
  event: CommunicationDomainEvent,
): CreateCommunicationHistoryEntryInput {
  const payload =
    event.payload &&
    typeof event.payload === "object"
      ? event.payload as Readonly<Record<string, unknown>>
      : { value: event.payload };

  return {
    id: event.id,
    companyId: event.context.companyId,
    tenantId: event.context.tenantId,
    organizationId:
      event.context.organizationId,
    conversationId:
      resolveConversationId(event),
    entryType:
      resolveHistoryEntryType(event),
    actorId: event.context.actorId,
    participantId:
      event.aggregateType === "participant"
        ? event.aggregateId
        : readPayloadString(
            event.payload,
            "participantId",
          ),
    messageId:
      event.aggregateType === "message"
        ? event.aggregateId
        : readPayloadString(
            event.payload,
            "messageId",
          ),
    attachmentId:
      event.aggregateType === "attachment"
        ? event.aggregateId
        : readPayloadString(
            event.payload,
            "attachmentId",
          ),
    summary: event.type,
    payload,
    correlationId:
      event.context.correlationId,
    causationId:
      event.context.causationId,
    occurredAt: event.occurredAt,
  };
}
