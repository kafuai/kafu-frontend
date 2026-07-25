import type {
  CommunicationChannelKind,
} from "./channelDefinitions";

import {
  assertCommunicationTenantScope,
  type CommunicationAttributes,
  type CommunicationDeliveryStatus,
  type CommunicationDirection,
  type CommunicationDomainMetadata,
  type CommunicationId,
  type CommunicationMessageType,
  type CommunicationTimestamp,
} from "./communicationTypes";

export interface CommunicationMessageSender {
  readonly participantId: CommunicationId;
  readonly displayName: string;
  readonly externalSenderId?: string;
}

export interface CommunicationMessageDelivery {
  readonly status: CommunicationDeliveryStatus;
  readonly queuedAt?: CommunicationTimestamp;
  readonly sentAt?: CommunicationTimestamp;
  readonly deliveredAt?: CommunicationTimestamp;
  readonly readAt?: CommunicationTimestamp;
  readonly failedAt?: CommunicationTimestamp;
  readonly cancelledAt?: CommunicationTimestamp;
  readonly errorCode?: string;
  readonly errorMessage?: string;
}

export interface CommunicationMessage {
  readonly id: CommunicationId;
  readonly conversationId: CommunicationId;
  readonly sender: CommunicationMessageSender;
  readonly channel: CommunicationChannelKind;
  readonly direction: CommunicationDirection;
  readonly type: CommunicationMessageType;
  readonly content?: string;
  readonly delivery: CommunicationMessageDelivery;
  readonly metadata: CommunicationDomainMetadata;
  readonly replyToMessageId?: CommunicationId;
  readonly parentMessageId?: CommunicationId;
  readonly externalMessageId?: string;
  readonly externalConversationId?: string;
  readonly attachmentIds: readonly CommunicationId[];
  readonly sentAt: CommunicationTimestamp;
  readonly editedAt?: CommunicationTimestamp;
  readonly deletedAt?: CommunicationTimestamp;
  readonly attributes?: CommunicationAttributes;
}

export interface CreateCommunicationMessageInput {
  readonly id: CommunicationId;
  readonly conversationId: CommunicationId;
  readonly sender: CommunicationMessageSender;
  readonly channel: CommunicationChannelKind;
  readonly direction: CommunicationDirection;
  readonly type: CommunicationMessageType;
  readonly content?: string;
  readonly deliveryStatus?: CommunicationDeliveryStatus;
  readonly metadata: CommunicationDomainMetadata;
  readonly replyToMessageId?: CommunicationId;
  readonly parentMessageId?: CommunicationId;
  readonly externalMessageId?: string;
  readonly externalConversationId?: string;
  readonly attachmentIds?: readonly CommunicationId[];
  readonly sentAt?: CommunicationTimestamp;
  readonly attributes?: CommunicationAttributes;
}

export interface UpdateCommunicationMessageInput {
  readonly content?: string;
  readonly deliveryStatus?: CommunicationDeliveryStatus;
  readonly externalMessageId?: string;
  readonly attachmentIds?: readonly CommunicationId[];
  readonly editedAt?: CommunicationTimestamp;
  readonly deletedAt?: CommunicationTimestamp;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly updatedAt?: CommunicationTimestamp;
  readonly updatedBy?: CommunicationId;
  readonly attributes?: CommunicationAttributes;
}

export function createCommunicationMessage(
  input: CreateCommunicationMessageInput,
): CommunicationMessage {
  assertCommunicationTenantScope(input.metadata);

  if (!input.id.trim()) {
    throw new Error("Communication message id is required.");
  }

  if (!input.conversationId.trim()) {
    throw new Error("Communication conversation id is required.");
  }

  if (!input.sender.participantId.trim()) {
    throw new Error("Communication message sender is required.");
  }

  const content = input.content?.trim();
  const attachmentIds = [...new Set(input.attachmentIds ?? [])];

  if (!content && attachmentIds.length === 0 && input.type !== "event") {
    throw new Error(
      "Communication message requires content or an attachment.",
    );
  }

  const sentAt = input.sentAt ?? new Date().toISOString();
  const deliveryStatus = input.deliveryStatus ?? "pending";

  return {
    id: input.id,
    conversationId: input.conversationId,
    sender: {
      ...input.sender,
      displayName: input.sender.displayName.trim(),
    },
    channel: input.channel,
    direction: input.direction,
    type: input.type,
    content: content || undefined,
    delivery: {
      status: deliveryStatus,
      queuedAt:
        deliveryStatus === "queued" ? sentAt : undefined,
      sentAt:
        deliveryStatus === "sent" ||
        deliveryStatus === "delivered" ||
        deliveryStatus === "read"
          ? sentAt
          : undefined,
      deliveredAt:
        deliveryStatus === "delivered" ||
        deliveryStatus === "read"
          ? sentAt
          : undefined,
      readAt:
        deliveryStatus === "read" ? sentAt : undefined,
      failedAt:
        deliveryStatus === "failed" ? sentAt : undefined,
      cancelledAt:
        deliveryStatus === "cancelled" ? sentAt : undefined,
    },
    metadata: {
      ...input.metadata,
      createdAt: input.metadata.createdAt || sentAt,
      updatedAt: input.metadata.updatedAt || sentAt,
    },
    replyToMessageId: input.replyToMessageId,
    parentMessageId: input.parentMessageId,
    externalMessageId: input.externalMessageId,
    externalConversationId: input.externalConversationId,
    attachmentIds,
    sentAt,
    attributes: input.attributes,
  };
}

export function updateCommunicationMessage(
  message: CommunicationMessage,
  input: UpdateCommunicationMessageInput,
): CommunicationMessage {
  const updatedAt = input.updatedAt ?? new Date().toISOString();
  const nextStatus =
    input.deliveryStatus ?? message.delivery.status;

  const content =
    input.content === undefined
      ? message.content
      : input.content.trim() || undefined;

  const delivery: CommunicationMessageDelivery = {
    ...message.delivery,
    status: nextStatus,
    queuedAt:
      nextStatus === "queued"
        ? message.delivery.queuedAt ?? updatedAt
        : message.delivery.queuedAt,
    sentAt:
      nextStatus === "sent" ||
      nextStatus === "delivered" ||
      nextStatus === "read"
        ? message.delivery.sentAt ?? updatedAt
        : message.delivery.sentAt,
    deliveredAt:
      nextStatus === "delivered" ||
      nextStatus === "read"
        ? message.delivery.deliveredAt ?? updatedAt
        : message.delivery.deliveredAt,
    readAt:
      nextStatus === "read"
        ? message.delivery.readAt ?? updatedAt
        : message.delivery.readAt,
    failedAt:
      nextStatus === "failed"
        ? message.delivery.failedAt ?? updatedAt
        : message.delivery.failedAt,
    cancelledAt:
      nextStatus === "cancelled"
        ? message.delivery.cancelledAt ?? updatedAt
        : message.delivery.cancelledAt,
    errorCode:
      input.errorCode ?? message.delivery.errorCode,
    errorMessage:
      input.errorMessage ?? message.delivery.errorMessage,
  };

  return {
    ...message,
    content,
    delivery,
    externalMessageId:
      input.externalMessageId ?? message.externalMessageId,
    attachmentIds:
      input.attachmentIds === undefined
        ? message.attachmentIds
        : [...new Set(input.attachmentIds)],
    editedAt:
      input.editedAt ??
      (input.content !== undefined
        ? message.editedAt ?? updatedAt
        : message.editedAt),
    deletedAt: input.deletedAt ?? message.deletedAt,
    attributes: input.attributes ?? message.attributes,
    metadata: {
      ...message.metadata,
      updatedAt,
      updatedBy:
        input.updatedBy ?? message.metadata.updatedBy,
    },
  };
}

export function markCommunicationMessageDeleted(
  message: CommunicationMessage,
  deletedAt = new Date().toISOString(),
  deletedBy?: CommunicationId,
): CommunicationMessage {
  return {
    ...message,
    content: undefined,
    deletedAt,
    metadata: {
      ...message.metadata,
      updatedAt: deletedAt,
      updatedBy: deletedBy ?? message.metadata.updatedBy,
    },
  };
}
