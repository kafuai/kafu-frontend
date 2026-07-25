import type {
  CommunicationDomainEvent,
} from "./domain/domainEvents";

import type {
  CommunicationRealtimeEventType,
} from "./realtimeSynchronizationModels";

import type {
  PublishCommunicationRealtimeInput,
} from "./realtimeSynchronizationRuntime";

function resolveRealtimeEventType(
  event: CommunicationDomainEvent,
): CommunicationRealtimeEventType {
  switch (event.type) {
    case "conversation.created":
      return "conversation.created";

    case "conversation.updated":
    case "conversation.resolved":
    case "conversation.archived":
      return "conversation.updated";

    case "participant.added":
      return "participant.joined";

    case "participant.updated":
      return "participant.updated";

    case "participant.removed":
      return "participant.left";

    case "message.created":
    case "message.queued":
      return "message.created";

    case "message.sent":
    case "message.delivered":
    case "message.read":
    case "message.failed":
      return "message.delivery_updated";

    case "message.updated":
      return "message.updated";

    case "message.deleted":
      return "message.deleted";

    case "attachment.created":
    case "attachment.processing":
    case "attachment.ready":
    case "attachment.failed":
    case "attachment.deleted":
      return "attachment.updated";

    case "channel.status_changed":
    default:
      return "synchronization.requested";
  }
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

function resolveConversationId(
  event: CommunicationDomainEvent,
): string | undefined {
  if (event.aggregateType === "conversation") {
    return event.aggregateId;
  }

  return readPayloadString(
    event.payload,
    "conversationId",
  );
}

export function mapCommunicationDomainEventToRealtime(
  event: CommunicationDomainEvent,
): PublishCommunicationRealtimeInput {
  const payload =
    event.payload &&
    typeof event.payload === "object"
      ? event.payload as Readonly<
          Record<string, unknown>
        >
      : {
          value: event.payload,
        };

  return {
    id: event.id,
    type: resolveRealtimeEventType(event),
    scope: {
      companyId: event.context.companyId,
      tenantId: event.context.tenantId,
      organizationId:
        event.context.organizationId,
      conversationId:
        resolveConversationId(event),
      participantId:
        event.aggregateType === "participant"
          ? event.aggregateId
          : readPayloadString(
              event.payload,
              "participantId",
            ),
    },
    payload: {
      aggregateId: event.aggregateId,
      aggregateType: event.aggregateType,
      domainEventType: event.type,
      ...payload,
    },
    correlationId:
      event.context.correlationId,
    causationId:
      event.context.causationId,
    occurredAt: event.occurredAt,
    source:
      event.context.source ??
      "communication-domain",
  };
}
