export type CommunicationRealtimeEventType =
  | "conversation.created"
  | "conversation.updated"
  | "conversation.deleted"
  | "participant.joined"
  | "participant.updated"
  | "participant.left"
  | "message.created"
  | "message.updated"
  | "message.deleted"
  | "message.delivery_updated"
  | "attachment.updated"
  | "presence.updated"
  | "notification.created"
  | "notification.updated"
  | "history.appended"
  | "synchronization.requested"
  | "synchronization.completed";

export interface CommunicationRealtimeScope {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly conversationId?: string;
  readonly participantId?: string;
}

export interface CommunicationRealtimeEvent<
  TPayload = Readonly<Record<string, unknown>>,
> {
  readonly id: string;
  readonly type: CommunicationRealtimeEventType;
  readonly scope: CommunicationRealtimeScope;
  readonly payload: TPayload;
  readonly sequence: number;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly occurredAt: string;
  readonly source: string;
}

export interface CreateCommunicationRealtimeEventInput<
  TPayload = Readonly<Record<string, unknown>>,
> {
  readonly id: string;
  readonly type: CommunicationRealtimeEventType;
  readonly scope: CommunicationRealtimeScope;
  readonly payload: TPayload;
  readonly sequence: number;
  readonly correlationId?: string;
  readonly causationId?: string;
  readonly occurredAt?: string;
  readonly source?: string;
}

export function createCommunicationRealtimeEvent<
  TPayload,
>(
  input: CreateCommunicationRealtimeEventInput<TPayload>,
): CommunicationRealtimeEvent<TPayload> {
  if (!input.id.trim()) {
    throw new Error(
      "Communication realtime event id is required.",
    );
  }

  if (!input.scope.companyId.trim()) {
    throw new Error(
      "Communication realtime company id is required.",
    );
  }

  if (!input.scope.tenantId.trim()) {
    throw new Error(
      "Communication realtime tenant id is required.",
    );
  }

  if (!input.scope.organizationId.trim()) {
    throw new Error(
      "Communication realtime organization id is required.",
    );
  }

  if (
    !Number.isInteger(input.sequence) ||
    input.sequence < 1
  ) {
    throw new Error(
      "Communication realtime sequence must be a positive integer.",
    );
  }

  return {
    ...input,
    occurredAt:
      input.occurredAt ?? new Date().toISOString(),
    source:
      input.source ?? "communication-realtime",
  };
}
