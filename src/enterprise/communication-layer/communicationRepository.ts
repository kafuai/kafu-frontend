import type {
  CommunicationChannel,
  CommunicationConversation,
  CommunicationConversationType,
  CommunicationMessage,
  CommunicationMessageType,
  CommunicationMetadata,
  CommunicationParticipantType,
} from "./communicationModels";

export interface CreateConversationInput {
  companyId: string;
  conversationType?: CommunicationConversationType;
  channel?: CommunicationChannel;
  title?: string;
  createdBy?: string;
  createdByName?: string;
  metadata?: CommunicationMetadata;
}

export interface CreateMessageInput {
  companyId: string;
  conversationId: string;
  senderType: CommunicationParticipantType;
  senderId?: string;
  senderName?: string;
  messageType?: CommunicationMessageType;
  content?: string;
  parentMessageId?: string;
  metadata?: CommunicationMetadata;
}

export interface CommunicationRepository {
  createConversation(
    input: CreateConversationInput
  ): Promise<CommunicationConversation>;

  getConversation(
    companyId: string,
    conversationId: string
  ): Promise<CommunicationConversation | null>;

  listConversations(
    companyId: string
  ): Promise<CommunicationConversation[]>;

  createMessage(
    input: CreateMessageInput
  ): Promise<CommunicationMessage>;

  listMessages(
    companyId: string,
    conversationId: string
  ): Promise<CommunicationMessage[]>;
}
