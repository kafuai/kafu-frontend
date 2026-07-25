export type CommunicationPresenceStatus =
  | "online"
  | "away"
  | "busy"
  | "offline";

export type CommunicationPresenceSource =
  | "web"
  | "mobile"
  | "desktop"
  | "system";

export interface CommunicationPresence {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly participantId: string;
  readonly status: CommunicationPresenceStatus;
  readonly source: CommunicationPresenceSource;
  readonly connectionId?: string;
  readonly conversationId?: string;
  readonly lastSeenAt: string;
  readonly expiresAt?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface UpdateCommunicationPresenceInput {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly participantId: string;
  readonly status: CommunicationPresenceStatus;
  readonly source: CommunicationPresenceSource;
  readonly connectionId?: string;
  readonly conversationId?: string;
  readonly expiresAt?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export function createCommunicationPresence(
  input: UpdateCommunicationPresenceInput,
): CommunicationPresence {
  if (!input.companyId.trim()) {
    throw new Error("Communication presence company id is required.");
  }

  if (!input.tenantId.trim()) {
    throw new Error("Communication presence tenant id is required.");
  }

  if (!input.organizationId.trim()) {
    throw new Error(
      "Communication presence organization id is required.",
    );
  }

  if (!input.participantId.trim()) {
    throw new Error(
      "Communication presence participant id is required.",
    );
  }

  return {
    ...input,
    lastSeenAt: new Date().toISOString(),
  };
}

export function isCommunicationPresenceActive(
  presence: CommunicationPresence,
  now = new Date(),
): boolean {
  if (presence.status === "offline") {
    return false;
  }

  if (!presence.expiresAt) {
    return true;
  }

  return new Date(presence.expiresAt).getTime() > now.getTime();
}
