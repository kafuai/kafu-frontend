import type { CommunicationAttachment } from "./communicationAttachment";
import type {
  CommunicationConversation,
  CommunicationDeliveryStatus,
  CommunicationMessage,
} from "./communicationTypes";

export interface CommunicationConversationQuery {
  readonly companyId: string;
  readonly channel?: CommunicationConversation["channel"];
  readonly status?: CommunicationConversation["status"];
  readonly limit?: number;
}

export interface CommunicationMessageQuery {
  readonly companyId: string;
  readonly conversationId: string;
  readonly limit?: number;
}

export interface CommunicationRepository {
  createConversation(
    conversation: CommunicationConversation,
  ): Promise<CommunicationConversation>;

  updateConversation(
    conversation: CommunicationConversation,
  ): Promise<CommunicationConversation>;

  findConversationById(
    companyId: string,
    conversationId: string,
  ): Promise<CommunicationConversation | null>;

  listConversations(
    query: CommunicationConversationQuery,
  ): Promise<readonly CommunicationConversation[]>;

  createMessage(
    companyId: string,
    message: CommunicationMessage,
  ): Promise<CommunicationMessage>;

  updateMessageDeliveryStatus(
    companyId: string,
    messageId: string,
    status: CommunicationDeliveryStatus,
    errorMessage?: string,
  ): Promise<CommunicationMessage>;

  listMessages(
    query: CommunicationMessageQuery,
  ): Promise<readonly CommunicationMessage[]>;

  createAttachment(
    attachment: CommunicationAttachment,
  ): Promise<CommunicationAttachment>;

  listAttachments(
    companyId: string,
    messageId: string,
  ): Promise<readonly CommunicationAttachment[]>;
}
