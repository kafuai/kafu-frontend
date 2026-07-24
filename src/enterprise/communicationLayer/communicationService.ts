import type { CommunicationAttachment } from "./communicationAttachment";
import type {
  CommunicationChannelAdapter,
  CommunicationSendResult,
} from "./communicationChannelAdapter";
import {
  createCommunicationConversation,
  createCommunicationMessage,
  touchCommunicationConversation,
} from "./communicationFactory";
import type {
  CommunicationConversationQuery,
  CommunicationMessageQuery,
  CommunicationRepository,
} from "./communicationRepository";
import type {
  CommunicationConversation,
  CommunicationDeliveryStatus,
  CommunicationMessage,
  CommunicationParticipant,
} from "./communicationTypes";

export interface CreateCommunicationConversationInput {
  readonly id: string;
  readonly companyId: string;
  readonly createdBy: string;
  readonly channel: CommunicationConversation["channel"];
  readonly subject?: string;
  readonly tenantId?: string;
  readonly organizationId?: string;
  readonly participants?: readonly CommunicationParticipant[];
  readonly priority?: CommunicationConversation["priority"];
  readonly tags?: readonly string[];
  readonly externalReferenceId?: string;
}

export interface SendCommunicationMessageInput {
  readonly id: string;
  readonly companyId: string;
  readonly conversationId: string;
  readonly senderId: string;
  readonly content: string;
  readonly type?: CommunicationMessage["type"];
  readonly direction?: CommunicationMessage["direction"];
  readonly replyToMessageId?: string;
  readonly attachments?: readonly CommunicationAttachment[];
}

export class CommunicationService {
  constructor(
    private readonly repository: CommunicationRepository,
  ) {}

  async createConversation(
    input: CreateCommunicationConversationInput,
  ): Promise<CommunicationConversation> {
    const conversation = createCommunicationConversation({
      ...input,
      status: "active",
    });

    return this.repository.createConversation(conversation);
  }

  async getConversation(
    companyId: string,
    conversationId: string,
  ): Promise<CommunicationConversation> {
    const conversation = await this.repository.findConversationById(
      companyId,
      conversationId,
    );

    if (!conversation) {
      throw new Error(
        `Communication conversation was not found: ${conversationId}`,
      );
    }

    return conversation;
  }

  async listConversations(
    query: CommunicationConversationQuery,
  ): Promise<readonly CommunicationConversation[]> {
    return this.repository.listConversations(query);
  }

  async listMessages(
    query: CommunicationMessageQuery,
  ): Promise<readonly CommunicationMessage[]> {
    return this.repository.listMessages(query);
  }

  async createQueuedMessage(
    input: SendCommunicationMessageInput,
  ): Promise<CommunicationMessage> {
    const conversation = await this.getConversation(
      input.companyId,
      input.conversationId,
    );

    if (
      conversation.status === "archived" ||
      conversation.status === "completed"
    ) {
      throw new Error(
        `Cannot add messages to a ${conversation.status} conversation.`,
      );
    }

    const message = createCommunicationMessage({
      id: input.id,
      conversationId: input.conversationId,
      senderId: input.senderId,
      channel: conversation.channel,
      direction: input.direction ?? "outbound",
      type: input.type,
      content: input.content,
      deliveryStatus: "queued",
      replyToMessageId: input.replyToMessageId,
    });

    const savedMessage = await this.repository.createMessage(
      input.companyId,
      message,
    );

    for (const attachment of input.attachments ?? []) {
      if (
        attachment.companyId !== input.companyId ||
        attachment.conversationId !== input.conversationId ||
        attachment.messageId !== input.id
      ) {
        throw new Error(
          "Communication attachment does not match the target message.",
        );
      }

      await this.repository.createAttachment(attachment);
    }

    const updatedConversation = touchCommunicationConversation(
      conversation,
      savedMessage.createdAt,
    );

    await this.repository.updateConversation(updatedConversation);

    return savedMessage;
  }

  async updateDeliveryStatus(
    companyId: string,
    messageId: string,
    status: CommunicationDeliveryStatus,
    errorMessage?: string,
  ): Promise<CommunicationMessage> {
    return this.repository.updateMessageDeliveryStatus(
      companyId,
      messageId,
      status,
      errorMessage,
    );
  }

  async dispatchMessage(
    input: SendCommunicationMessageInput,
    adapter: CommunicationChannelAdapter,
  ): Promise<CommunicationMessage> {
    const queuedMessage = await this.createQueuedMessage(input);
    const conversation = await this.getConversation(
      input.companyId,
      input.conversationId,
    );

    adapter.validateConversation(conversation);

    await this.updateDeliveryStatus(
      input.companyId,
      queuedMessage.id,
      "sending",
    );

    try {
      const attachments = await this.repository.listAttachments(
        input.companyId,
        queuedMessage.id,
      );

      const result: CommunicationSendResult = await adapter.send({
        companyId: input.companyId,
        conversation,
        message: queuedMessage,
        attachments,
      });

      return this.repository.updateMessageDeliveryStatus(
        input.companyId,
        queuedMessage.id,
        result.deliveredAt ? "delivered" : "sent",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown communication delivery error.";

      await this.repository.updateMessageDeliveryStatus(
        input.companyId,
        queuedMessage.id,
        "failed",
        message,
      );

      throw error;
    }
  }
}
