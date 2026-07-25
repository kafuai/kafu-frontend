import {
  createCommunicationAuditEntry,
  type CommunicationAuditAction,
  type CommunicationAuditWriter,
} from "../communicationAudit";

import type {
  CommunicationDomainEvent,
} from "../domain/domainEvents";

import type {
  CommunicationDomainEventPublisher,
} from "./communicationDomainEventPublisher";

function resolveAuditAction(
  event: CommunicationDomainEvent,
): CommunicationAuditAction {
  switch (event.type) {
    case "conversation.created":
      return "conversation_created";

    case "conversation.updated":
    case "conversation.resolved":
    case "conversation.archived":
      return "conversation_updated";

    case "message.created":
    case "message.queued":
      return "message_created";

    case "message.sent":
    case "message.delivered":
    case "message.read":
    case "message.failed":
    case "message.updated":
      return "delivery_updated";

    case "attachment.created":
    case "attachment.processing":
    case "attachment.ready":
    case "attachment.failed":
    case "attachment.deleted":
      return "attachment_created";

    case "participant.added":
    case "participant.updated":
    case "participant.removed":
    case "message.deleted":
    case "channel.status_changed":
    default:
      return "conversation_updated";
  }
}

function resolveConversationId(
  event: CommunicationDomainEvent,
): string | undefined {
  if (
    event.aggregateType === "conversation"
  ) {
    return event.aggregateId;
  }

  const payload = event.payload;

  if (
    payload &&
    typeof payload === "object" &&
    "conversationId" in payload &&
    typeof payload.conversationId === "string"
  ) {
    return payload.conversationId;
  }

  return undefined;
}

function resolveMessageId(
  event: CommunicationDomainEvent,
): string | undefined {
  if (event.aggregateType === "message") {
    return event.aggregateId;
  }

  const payload = event.payload;

  if (
    payload &&
    typeof payload === "object" &&
    "messageId" in payload &&
    typeof payload.messageId === "string"
  ) {
    return payload.messageId;
  }

  return undefined;
}

export class AuditCommunicationDomainEventPublisher
  implements CommunicationDomainEventPublisher
{
  constructor(
    private readonly auditWriter:
      CommunicationAuditWriter,
  ) {}

  async publish(
    event: CommunicationDomainEvent,
  ): Promise<void> {
    const payload =
      event.payload &&
      typeof event.payload === "object"
        ? event.payload
        : {
            value: event.payload,
          };

    await this.auditWriter.write(
      createCommunicationAuditEntry({
        id: event.id,
        companyId: event.context.companyId,
        conversationId:
          resolveConversationId(event),
        messageId:
          resolveMessageId(event),
        action:
          resolveAuditAction(event),
        actorId:
          event.context.actorId ?? "system",
        source:
          event.context.source ??
          "communication-domain",
        details: {
          domainEventType: event.type,
          aggregateId: event.aggregateId,
          aggregateType: event.aggregateType,
          tenantId: event.context.tenantId,
          organizationId:
            event.context.organizationId,
          correlationId:
            event.context.correlationId,
          causationId:
            event.context.causationId,
          version: event.version,
          payload,
          attributes:
            event.attributes ?? {},
        },
        createdAt: event.occurredAt,
      }),
    );
  }

  async publishMany(
    events: readonly CommunicationDomainEvent[],
  ): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
