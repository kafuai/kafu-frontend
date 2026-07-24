import {
  createCommunicationAuditEntry,
  type CommunicationAuditWriter,
} from "./communicationAudit";
import {
  createCommunicationConversation,
  createCommunicationMessage,
  touchCommunicationConversation,
} from "./communicationFactory";
import type {
  DeliveryCommunicationPayload,
  IncomingCommunicationPayload,
} from "./communicationEvent";
import type {
  CommunicationRepository,
} from "./communicationRepository";
import type {
  CommunicationChannel,
  CommunicationConversation,
  CommunicationMessage,
  CommunicationParticipant,
} from "./communicationTypes";

export interface ReceiveInboundMessageInput {
  readonly eventId: string;
  readonly companyId: string;
  readonly channel: CommunicationChannel;
  readonly payload: IncomingCommunicationPayload;
  readonly conversationId?: string;
  readonly createdBy?: string;
}

export class CommunicationInboundService {
  constructor(
    private readonly repository: CommunicationRepository,
    private readonly auditWriter: CommunicationAuditWriter,
  ) {}

  async receiveMessage(
    input: ReceiveInboundMessageInput,
  ): Promise<CommunicationMessage> {
    const conversation =
      (input.conversationId
        ? await this.repository.findConversationById(
            input.companyId,
            input.conversationId,
          )
        : null) ??
      (await this.createInboundConversation(input));

    const message = createCommunicationMessage({
      id: input.eventId,
      conversationId: conversation.id,
      senderId: input.payload.senderExternalId,
      channel: input.channel,
      direction: "inbound",
      type: input.payload.messageType ?? "text",
      content: input.payload.content,
      deliveryStatus: "delivered",
      externalMessageId: input.payload.externalMessageId,
      createdAt: input.payload.receivedAt,
    });

    const savedMessage = await this.repository.createMessage(
      input.companyId,
      message,
    );

    await this.repository.updateConversation(
      touchCommunicationConversation(
        conversation,
        savedMessage.createdAt,
      ),
    );

    await this.auditWriter.write(
      createCommunicationAuditEntry({
        id: `${input.eventId}:audit`,
        companyId: input.companyId,
        conversationId: conversation.id,
        messageId: savedMessage.id,
        action: "message_received",
        channel: input.channel,
        deliveryStatus: savedMessage.deliveryStatus,
        actorId: input.payload.senderExternalId,
        source: "communication-webhook",
        details: {
          externalMessageId:
            input.payload.externalMessageId,
          externalConversationId:
            input.payload.externalConversationId,
        },
      }),
    );

    return savedMessage;
  }

  async updateDelivery(
    input: {
      readonly eventId: string;
      readonly companyId: string;
      readonly messageId: string;
      readonly channel: CommunicationChannel;
      readonly payload: DeliveryCommunicationPayload;
    },
  ): Promise<CommunicationMessage> {
    const message =
      await this.repository.updateMessageDeliveryStatus(
        input.companyId,
        input.messageId,
        input.payload.status,
        input.payload.errorMessage,
      );

    await this.auditWriter.write(
      createCommunicationAuditEntry({
        id: `${input.eventId}:audit`,
        companyId: input.companyId,
        conversationId: message.conversationId,
        messageId: message.id,
        action: "delivery_updated",
        channel: input.channel,
        deliveryStatus: message.deliveryStatus,
        actorId: "communication-provider",
        source: "communication-webhook",
        details: {
          externalMessageId:
            input.payload.externalMessageId,
          metadata: input.payload.metadata ?? {},
        },
      }),
    );

    return message;
  }

  private async createInboundConversation(
    input: ReceiveInboundMessageInput,
  ): Promise<CommunicationConversation> {
    const participant: CommunicationParticipant = {
      id: input.payload.senderExternalId,
      type: "external",
      role: "user",
      displayName: input.payload.senderDisplayName,
      email: input.payload.senderEmail,
      phone: input.payload.senderPhone,
    };

    const conversation = createCommunicationConversation({
      id:
        input.payload.externalConversationId ??
        crypto.randomUUID(),
      companyId: input.companyId,
      createdBy:
        input.createdBy ??
        input.payload.senderExternalId,
      channel: input.channel,
      participants: [participant],
      externalReferenceId:
        input.payload.externalConversationId,
      tags: ["inbound"],
    });

    const savedConversation =
      await this.repository.createConversation(conversation);

    await this.auditWriter.write(
      createCommunicationAuditEntry({
        id: `${input.eventId}:conversation:audit`,
        companyId: input.companyId,
        conversationId: savedConversation.id,
        action: "conversation_created",
        channel: input.channel,
        actorId: input.payload.senderExternalId,
        source: "communication-webhook",
        details: {
          externalConversationId:
            input.payload.externalConversationId,
        },
      }),
    );

    return savedConversation;
  }
}
