import type {
  ConversationChannel,
  ConversationPriority,
  ConversationRole,
  ConversationStatus,
} from "../conversationEngine";

export type CommunicationChannel =
  | ConversationChannel
  | "internal_chat"
  | "voice";

export type CommunicationDirection =
  | "inbound"
  | "outbound"
  | "internal";

export type CommunicationDeliveryStatus =
  | "draft"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export type CommunicationMessageType =
  | "text"
  | "voice"
  | "image"
  | "document"
  | "system"
  | "event";

export type CommunicationParticipantType =
  | "customer"
  | "employee"
  | "ai"
  | "system"
  | "external";

export interface CommunicationParticipant {
  readonly id: string;
  readonly type: CommunicationParticipantType;
  readonly role: ConversationRole;
  readonly displayName: string;
  readonly email?: string;
  readonly phone?: string;
  readonly avatarUrl?: string;
}

export interface CommunicationMetadata {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy: string;
  readonly tags: readonly string[];
}

export interface CommunicationConversation {
  readonly id: string;
  readonly subject?: string;
  readonly channel: CommunicationChannel;
  readonly status: ConversationStatus;
  readonly priority: ConversationPriority;
  readonly participants: readonly CommunicationParticipant[];
  readonly metadata: CommunicationMetadata;
  readonly externalReferenceId?: string;
  readonly lastMessageAt?: string;
}

export interface CommunicationMessage {
  readonly id: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly channel: CommunicationChannel;
  readonly direction: CommunicationDirection;
  readonly type: CommunicationMessageType;
  readonly content: string;
  readonly deliveryStatus: CommunicationDeliveryStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly replyToMessageId?: string;
  readonly externalMessageId?: string;
  readonly errorMessage?: string;
}
