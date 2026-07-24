import type {
  CommunicationChannel,
  CommunicationDeliveryStatus,
  CommunicationMessageType,
} from "./communicationTypes";

export type CommunicationEventType =
  | "conversation.created"
  | "conversation.updated"
  | "message.received"
  | "message.queued"
  | "message.sent"
  | "message.delivered"
  | "message.read"
  | "message.failed"
  | "attachment.created";

export interface CommunicationEvent<TPayload = unknown> {
  readonly id: string;
  readonly type: CommunicationEventType;
  readonly companyId: string;
  readonly conversationId: string;
  readonly messageId?: string;
  readonly channel: CommunicationChannel;
  readonly payload: TPayload;
  readonly occurredAt: string;
  readonly source: string;
}

export interface IncomingCommunicationPayload {
  readonly externalMessageId: string;
  readonly externalConversationId?: string;
  readonly senderExternalId: string;
  readonly senderDisplayName: string;
  readonly senderEmail?: string;
  readonly senderPhone?: string;
  readonly content: string;
  readonly messageType?: CommunicationMessageType;
  readonly receivedAt?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface DeliveryCommunicationPayload {
  readonly externalMessageId: string;
  readonly status: CommunicationDeliveryStatus;
  readonly occurredAt?: string;
  readonly errorMessage?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export function createCommunicationEvent<TPayload>(
  input: Omit<CommunicationEvent<TPayload>, "occurredAt"> & {
    readonly occurredAt?: string;
  },
): CommunicationEvent<TPayload> {
  return {
    ...input,
    occurredAt: input.occurredAt ?? new Date().toISOString(),
  };
}
