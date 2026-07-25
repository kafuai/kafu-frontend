import {
  createCommunicationDomainEvent,
  type CommunicationDomainEvent,
  type CommunicationDomainEventContext,
  type CommunicationDomainEventType,
  type CommunicationMessageEventPayload,
} from "../domain/domainEvents";

import type {
  CommunicationConversation,
  CommunicationDeliveryStatus,
  CommunicationMessage,
  CommunicationMetadata,
} from "../communicationTypes";

export type CommunicationEventIdFactory = () => string;

export function createDefaultCommunicationEventId(): string {
  const cryptoApi = globalThis.crypto;

  if (cryptoApi?.randomUUID) {
    return cryptoApi.randomUUID();
  }

  return [
    "communication-event",
    Date.now().toString(36),
    Math.random().toString(36).slice(2),
  ].join("-");
}

function createEventContext(
  metadata: CommunicationMetadata,
  actorId?: string,
  source = "communication-application-service",
): CommunicationDomainEventContext {
  return {
    companyId: metadata.companyId,
    tenantId: metadata.tenantId,
    organizationId: metadata.organizationId,
    actorId,
    source,
  };
}

export function createConversationCreatedEvent(
  conversation: CommunicationConversation,
  eventId: string,
): CommunicationDomainEvent<
  "conversation.created",
  {
    readonly conversationId: string;
  }
> {
  return createCommunicationDomainEvent({
    id: eventId,
    type: "conversation.created",
    aggregateId: conversation.id,
    aggregateType: "conversation",
    occurredAt: conversation.metadata.createdAt,
    context: createEventContext(
      conversation.metadata,
      conversation.metadata.createdBy,
    ),
    payload: {
      conversationId: conversation.id,
    },
  });
}

export function createMessageCreatedEvent(
  conversation: CommunicationConversation,
  message: CommunicationMessage,
  eventId: string,
): CommunicationDomainEvent<
  "message.created",
  CommunicationMessageEventPayload
> {
  return createCommunicationDomainEvent({
    id: eventId,
    type: "message.created",
    aggregateId: message.id,
    aggregateType: "message",
    occurredAt: message.createdAt,
    context: createEventContext(
      conversation.metadata,
      message.senderId,
    ),
    payload: {
      messageId: message.id,
      conversationId: message.conversationId,
      externalMessageId: message.externalMessageId,
    },
  });
}

function resolveDeliveryEventType(
  status: CommunicationDeliveryStatus,
): CommunicationDomainEventType {
  switch (status) {
    case "queued":
      return "message.queued";

    case "sent":
      return "message.sent";

    case "delivered":
      return "message.delivered";

    case "read":
      return "message.read";

    case "failed":
      return "message.failed";

    case "draft":
    case "sending":
    default:
      return "message.updated";
  }
}

export function createMessageDeliveryEvent(
  conversation: CommunicationConversation,
  message: CommunicationMessage,
  eventId: string,
): CommunicationDomainEvent<
  CommunicationDomainEventType,
  CommunicationMessageEventPayload
> {
  return createCommunicationDomainEvent({
    id: eventId,
    type: resolveDeliveryEventType(
      message.deliveryStatus,
    ),
    aggregateId: message.id,
    aggregateType: "message",
    occurredAt: message.updatedAt,
    context: createEventContext(
      conversation.metadata,
      message.senderId,
    ),
    payload: {
      messageId: message.id,
      conversationId: message.conversationId,
      deliveryStatus: message.deliveryStatus,
      externalMessageId: message.externalMessageId,
      errorMessage: message.errorMessage,
    },
  });
}
