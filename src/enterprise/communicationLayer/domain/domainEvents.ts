import type {
  CommunicationChannelKind,
} from "./channelDefinitions";

import type {
  CommunicationAttachmentStatus,
} from "./attachmentModels";

import type {
  CommunicationParticipantStatus,
} from "./participantModels";

import type {
  CommunicationAttributes,
  CommunicationDeliveryStatus,
  CommunicationId,
  CommunicationLifecycleStatus,
  CommunicationTimestamp,
} from "./communicationTypes";

export type CommunicationDomainEventType =
  | "conversation.created"
  | "conversation.updated"
  | "conversation.resolved"
  | "conversation.archived"
  | "participant.added"
  | "participant.updated"
  | "participant.removed"
  | "message.created"
  | "message.updated"
  | "message.queued"
  | "message.sent"
  | "message.delivered"
  | "message.read"
  | "message.failed"
  | "message.deleted"
  | "attachment.created"
  | "attachment.processing"
  | "attachment.ready"
  | "attachment.failed"
  | "attachment.deleted"
  | "channel.status_changed";

export interface CommunicationDomainEventContext {
  readonly companyId: CommunicationId;
  readonly tenantId: CommunicationId;
  readonly organizationId: CommunicationId;
  readonly correlationId?: CommunicationId;
  readonly causationId?: CommunicationId;
  readonly actorId?: CommunicationId;
  readonly source?: string;
}

export interface CommunicationDomainEvent<
  TType extends CommunicationDomainEventType =
    CommunicationDomainEventType,
  TPayload = unknown,
> {
  readonly id: CommunicationId;
  readonly type: TType;
  readonly aggregateId: CommunicationId;
  readonly aggregateType:
    | "conversation"
    | "participant"
    | "message"
    | "attachment"
    | "channel";
  readonly occurredAt: CommunicationTimestamp;
  readonly version: number;
  readonly context: CommunicationDomainEventContext;
  readonly payload: TPayload;
  readonly attributes?: CommunicationAttributes;
}

export interface CommunicationConversationEventPayload {
  readonly conversationId: CommunicationId;
  readonly status?: CommunicationLifecycleStatus;
  readonly previousStatus?: CommunicationLifecycleStatus;
}

export interface CommunicationParticipantEventPayload {
  readonly participantId: CommunicationId;
  readonly conversationId?: CommunicationId;
  readonly status?: CommunicationParticipantStatus;
  readonly previousStatus?: CommunicationParticipantStatus;
}

export interface CommunicationMessageEventPayload {
  readonly messageId: CommunicationId;
  readonly conversationId: CommunicationId;
  readonly deliveryStatus?: CommunicationDeliveryStatus;
  readonly previousDeliveryStatus?: CommunicationDeliveryStatus;
  readonly externalMessageId?: string;
  readonly errorCode?: string;
  readonly errorMessage?: string;
}

export interface CommunicationAttachmentEventPayload {
  readonly attachmentId: CommunicationId;
  readonly conversationId: CommunicationId;
  readonly messageId?: CommunicationId;
  readonly status?: CommunicationAttachmentStatus;
  readonly previousStatus?: CommunicationAttachmentStatus;
}

export interface CommunicationChannelEventPayload {
  readonly channel: CommunicationChannelKind;
  readonly previousStatus?: string;
  readonly status: string;
  readonly provider?: string;
}

export function createCommunicationDomainEvent<
  TType extends CommunicationDomainEventType,
  TPayload,
>(
  event: Omit<
    CommunicationDomainEvent<TType, TPayload>,
    "occurredAt" | "version"
  > & {
    readonly occurredAt?: CommunicationTimestamp;
    readonly version?: number;
  },
): CommunicationDomainEvent<TType, TPayload> {
  if (!event.id.trim()) {
    throw new Error("Communication domain event id is required.");
  }

  if (!event.aggregateId.trim()) {
    throw new Error(
      "Communication domain event aggregate id is required.",
    );
  }

  if (!event.context.companyId.trim()) {
    throw new Error(
      "Communication domain event company id is required.",
    );
  }

  if (!event.context.tenantId.trim()) {
    throw new Error(
      "Communication domain event tenant id is required.",
    );
  }

  if (!event.context.organizationId.trim()) {
    throw new Error(
      "Communication domain event organization id is required.",
    );
  }

  const version = event.version ?? 1;

  if (!Number.isInteger(version) || version < 1) {
    throw new Error(
      "Communication domain event version must be a positive integer.",
    );
  }

  return {
    ...event,
    occurredAt:
      event.occurredAt ?? new Date().toISOString(),
    version,
  };
}

export function isCommunicationDomainEvent(
  value: unknown,
): value is CommunicationDomainEvent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CommunicationDomainEvent>;

  return (
    typeof candidate.id === "string" &&
    candidate.id.trim().length > 0 &&
    typeof candidate.type === "string" &&
    typeof candidate.aggregateId === "string" &&
    candidate.aggregateId.trim().length > 0 &&
    typeof candidate.occurredAt === "string" &&
    typeof candidate.version === "number" &&
    candidate.version >= 1 &&
    typeof candidate.context === "object" &&
    candidate.context !== null
  );
}

export function sortCommunicationDomainEvents(
  events: readonly CommunicationDomainEvent[],
): readonly CommunicationDomainEvent[] {
  return [...events].sort((left, right) => {
    const timeDifference =
      new Date(left.occurredAt).getTime() -
      new Date(right.occurredAt).getTime();

    if (timeDifference !== 0) {
      return timeDifference;
    }

    return left.version - right.version;
  });
}
