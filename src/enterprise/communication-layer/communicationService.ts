import type {
  CommunicationConversation,
  CommunicationMessage,
} from "./communicationModels";

import type {
  CommunicationRepository,
  CreateConversationInput,
  CreateMessageInput,
} from "./communicationRepository";

export class CommunicationService {
  constructor(
    private readonly repository: CommunicationRepository
  ) {}

  createConversation(
    input: CreateConversationInput
  ): Promise<CommunicationConversation> {
    if (!input.companyId.trim()) {
      throw new Error("A company ID is required.");
    }

    return this.repository.createConversation(input);
  }

  getConversation(
    companyId: string,
    conversationId: string
  ): Promise<CommunicationConversation | null> {
    if (!companyId.trim() || !conversationId.trim()) {
      throw new Error(
        "Company ID and conversation ID are required."
      );
    }

    return this.repository.getConversation(
      companyId,
      conversationId
    );
  }

  listConversations(
    companyId: string
  ): Promise<CommunicationConversation[]> {
    if (!companyId.trim()) {
      throw new Error("A company ID is required.");
    }

    return this.repository.listConversations(companyId);
  }

  sendMessage(
    input: CreateMessageInput
  ): Promise<CommunicationMessage> {
    if (!input.companyId.trim()) {
      throw new Error("A company ID is required.");
    }

    if (!input.conversationId.trim()) {
      throw new Error("A conversation ID is required.");
    }

    return this.repository.createMessage(input);
  }

  listMessages(
    companyId: string,
    conversationId: string
  ): Promise<CommunicationMessage[]> {
    if (!companyId.trim() || !conversationId.trim()) {
      throw new Error(
        "Company ID and conversation ID are required."
      );
    }

    return this.repository.listMessages(
      companyId,
      conversationId
    );
  }
}
