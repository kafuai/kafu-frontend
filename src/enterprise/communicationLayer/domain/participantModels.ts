import {
  assertCommunicationTenantScope,
  type CommunicationAttributes,
  type CommunicationDomainMetadata,
  type CommunicationId,
  type CommunicationParticipantRole,
  type CommunicationParticipantType,
  type CommunicationTimestamp,
} from "./communicationTypes";

export type CommunicationParticipantStatus =
  | "active"
  | "inactive"
  | "invited"
  | "suspended"
  | "left";

export interface CommunicationParticipantIdentity {
  readonly userId?: CommunicationId;
  readonly employeeId?: CommunicationId;
  readonly customerId?: CommunicationId;
  readonly externalId?: string;
  readonly aiAgentId?: CommunicationId;
}

export interface CommunicationParticipantContact {
  readonly email?: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
  readonly locale?: string;
  readonly timezone?: string;
}

export interface CommunicationParticipant {
  readonly id: CommunicationId;
  readonly type: CommunicationParticipantType;
  readonly role: CommunicationParticipantRole;
  readonly status: CommunicationParticipantStatus;
  readonly displayName: string;
  readonly identity: CommunicationParticipantIdentity;
  readonly contact?: CommunicationParticipantContact;
  readonly metadata: CommunicationDomainMetadata;
  readonly joinedAt?: CommunicationTimestamp;
  readonly leftAt?: CommunicationTimestamp;
  readonly attributes?: CommunicationAttributes;
}

export interface CreateCommunicationParticipantInput {
  readonly id: CommunicationId;
  readonly type: CommunicationParticipantType;
  readonly role: CommunicationParticipantRole;
  readonly status?: CommunicationParticipantStatus;
  readonly displayName: string;
  readonly identity?: CommunicationParticipantIdentity;
  readonly contact?: CommunicationParticipantContact;
  readonly metadata: CommunicationDomainMetadata;
  readonly joinedAt?: CommunicationTimestamp;
  readonly attributes?: CommunicationAttributes;
}

export interface UpdateCommunicationParticipantInput {
  readonly role?: CommunicationParticipantRole;
  readonly status?: CommunicationParticipantStatus;
  readonly displayName?: string;
  readonly identity?: CommunicationParticipantIdentity;
  readonly contact?: CommunicationParticipantContact;
  readonly joinedAt?: CommunicationTimestamp;
  readonly leftAt?: CommunicationTimestamp;
  readonly updatedAt?: CommunicationTimestamp;
  readonly updatedBy?: CommunicationId;
  readonly attributes?: CommunicationAttributes;
}

export function createCommunicationParticipant(
  input: CreateCommunicationParticipantInput,
): CommunicationParticipant {
  assertCommunicationTenantScope(input.metadata);

  if (!input.id.trim()) {
    throw new Error("Communication participant id is required.");
  }

  const displayName = input.displayName.trim();

  if (!displayName) {
    throw new Error(
      "Communication participant display name is required.",
    );
  }

  return {
    id: input.id,
    type: input.type,
    role: input.role,
    status: input.status ?? "active",
    displayName,
    identity: input.identity ?? {},
    contact: input.contact,
    metadata: input.metadata,
    joinedAt:
      input.joinedAt ??
      (input.status === "invited"
        ? undefined
        : new Date().toISOString()),
    attributes: input.attributes,
  };
}

export function updateCommunicationParticipant(
  participant: CommunicationParticipant,
  input: UpdateCommunicationParticipantInput,
): CommunicationParticipant {
  const updatedAt = input.updatedAt ?? new Date().toISOString();
  const nextStatus = input.status ?? participant.status;

  return {
    ...participant,
    role: input.role ?? participant.role,
    status: nextStatus,
    displayName:
      input.displayName === undefined
        ? participant.displayName
        : input.displayName.trim() || participant.displayName,
    identity: input.identity ?? participant.identity,
    contact: input.contact ?? participant.contact,
    joinedAt:
      input.joinedAt ??
      (nextStatus === "active"
        ? participant.joinedAt ?? updatedAt
        : participant.joinedAt),
    leftAt:
      input.leftAt ??
      (nextStatus === "left"
        ? participant.leftAt ?? updatedAt
        : participant.leftAt),
    attributes: input.attributes ?? participant.attributes,
    metadata: {
      ...participant.metadata,
      updatedAt,
      updatedBy:
        input.updatedBy ?? participant.metadata.updatedBy,
    },
  };
}

export function deactivateCommunicationParticipant(
  participant: CommunicationParticipant,
  updatedAt = new Date().toISOString(),
  updatedBy?: CommunicationId,
): CommunicationParticipant {
  return updateCommunicationParticipant(participant, {
    status: "inactive",
    updatedAt,
    updatedBy,
  });
}

export function removeCommunicationParticipant(
  participant: CommunicationParticipant,
  leftAt = new Date().toISOString(),
  updatedBy?: CommunicationId,
): CommunicationParticipant {
  return updateCommunicationParticipant(participant, {
    status: "left",
    leftAt,
    updatedAt: leftAt,
    updatedBy,
  });
}
