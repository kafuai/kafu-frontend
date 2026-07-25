import type {
  CommunicationChannelKind,
} from "./channelDefinitions";

import {
  assertCommunicationTenantScope,
  normalizeCommunicationTags,
  type CommunicationAttributes,
  type CommunicationConversationType,
  type CommunicationDomainMetadata,
  type CommunicationId,
  type CommunicationLifecycleStatus,
  type CommunicationPriority,
  type CommunicationTimestamp,
} from "./communicationTypes";

export interface CommunicationConversationParticipantReference {
  readonly participantId: CommunicationId;
  readonly joinedAt: CommunicationTimestamp;
  readonly leftAt?: CommunicationTimestamp;
}

export interface CommunicationConversation {
  readonly id: CommunicationId;
  readonly type: CommunicationConversationType;
  readonly subject?: string;
  readonly channel: CommunicationChannelKind;
  readonly status: CommunicationLifecycleStatus;
  readonly priority: CommunicationPriority;
  readonly participants: readonly CommunicationConversationParticipantReference[];
  readonly metadata: CommunicationDomainMetadata;
  readonly externalReferenceId?: string;
  readonly lastMessageId?: CommunicationId;
  readonly lastMessageAt?: CommunicationTimestamp;
  readonly resolvedAt?: CommunicationTimestamp;
  readonly archivedAt?: CommunicationTimestamp;
  readonly attributes?: CommunicationAttributes;
}

export interface CreateCommunicationConversationInput {
  readonly id: CommunicationId;
  readonly type: CommunicationConversationType;
  readonly subject?: string;
  readonly channel: CommunicationChannelKind;
  readonly status?: CommunicationLifecycleStatus;
  readonly priority?: CommunicationPriority;
  readonly participantIds?: readonly CommunicationId[];
  readonly metadata: CommunicationDomainMetadata;
  readonly externalReferenceId?: string;
  readonly attributes?: CommunicationAttributes;
}

export interface UpdateCommunicationConversationInput {
  readonly subject?: string;
  readonly status?: CommunicationLifecycleStatus;
  readonly priority?: CommunicationPriority;
  readonly lastMessageId?: CommunicationId;
  readonly lastMessageAt?: CommunicationTimestamp;
  readonly resolvedAt?: CommunicationTimestamp;
  readonly archivedAt?: CommunicationTimestamp;
  readonly tags?: readonly string[];
  readonly attributes?: CommunicationAttributes;
  readonly updatedAt?: CommunicationTimestamp;
  readonly updatedBy?: CommunicationId;
}

export function createCommunicationConversation(
  input: CreateCommunicationConversationInput,
): CommunicationConversation {
  assertCommunicationTenantScope(input.metadata);

  const now = input.metadata.createdAt || new Date().toISOString();
  const subject = input.subject?.trim();

  if (!input.id.trim()) {
    throw new Error("Communication conversation id is required.");
  }

  return {
    id: input.id,
    type: input.type,
    subject: subject || undefined,
    channel: input.channel,
    status: input.status ?? "active",
    priority: input.priority ?? "normal",
    participants: (input.participantIds ?? []).map(
      (participantId) => ({
        participantId,
        joinedAt: now,
      }),
    ),
    metadata: {
      ...input.metadata,
      createdAt: now,
      updatedAt: input.metadata.updatedAt || now,
      tags: normalizeCommunicationTags(input.metadata.tags),
    },
    externalReferenceId: input.externalReferenceId,
    attributes: input.attributes,
  };
}

export function updateCommunicationConversation(
  conversation: CommunicationConversation,
  input: UpdateCommunicationConversationInput,
): CommunicationConversation {
  const updatedAt = input.updatedAt ?? new Date().toISOString();
  const nextStatus = input.status ?? conversation.status;

  return {
    ...conversation,
    subject:
      input.subject === undefined
        ? conversation.subject
        : input.subject.trim() || undefined,
    status: nextStatus,
    priority: input.priority ?? conversation.priority,
    lastMessageId:
      input.lastMessageId ?? conversation.lastMessageId,
    lastMessageAt:
      input.lastMessageAt ?? conversation.lastMessageAt,
    resolvedAt:
      input.resolvedAt ??
      (nextStatus === "resolved"
        ? conversation.resolvedAt ?? updatedAt
        : conversation.resolvedAt),
    archivedAt:
      input.archivedAt ??
      (nextStatus === "archived"
        ? conversation.archivedAt ?? updatedAt
        : conversation.archivedAt),
    attributes: input.attributes ?? conversation.attributes,
    metadata: {
      ...conversation.metadata,
      updatedAt,
      updatedBy:
        input.updatedBy ?? conversation.metadata.updatedBy,
      tags:
        input.tags === undefined
          ? conversation.metadata.tags
          : normalizeCommunicationTags(input.tags),
    },
  };
}

export function addConversationParticipant(
  conversation: CommunicationConversation,
  participantId: CommunicationId,
  joinedAt = new Date().toISOString(),
): CommunicationConversation {
  const alreadyJoined = conversation.participants.some(
    (participant) =>
      participant.participantId === participantId &&
      !participant.leftAt,
  );

  if (alreadyJoined) {
    return conversation;
  }

  return {
    ...conversation,
    participants: [
      ...conversation.participants,
      {
        participantId,
        joinedAt,
      },
    ],
    metadata: {
      ...conversation.metadata,
      updatedAt: joinedAt,
    },
  };
}

export function removeConversationParticipant(
  conversation: CommunicationConversation,
  participantId: CommunicationId,
  leftAt = new Date().toISOString(),
): CommunicationConversation {
  return {
    ...conversation,
    participants: conversation.participants.map(
      (participant) =>
        participant.participantId === participantId &&
        !participant.leftAt
          ? {
              ...participant,
              leftAt,
            }
          : participant,
    ),
    metadata: {
      ...conversation.metadata,
      updatedAt: leftAt,
    },
  };
}
