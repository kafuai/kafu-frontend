import type {
  CommunicationChannelAdapter,
  CommunicationSendContext,
  CommunicationSendResult,
} from "../communicationChannelAdapter";

export interface WhatsAppTransport {
  send(input: {
    readonly companyId: string;
    readonly conversationId: string;
    readonly messageId: string;
    readonly content: string;
    readonly recipients: readonly string[];
  }): Promise<{
    readonly externalMessageId: string;
    readonly acceptedAt?: string;
  }>;
}

export class WhatsAppAdapter
  implements CommunicationChannelAdapter
{
  readonly channel = "whatsapp" as const;

  constructor(
    private readonly transport: WhatsAppTransport,
  ) {}

  validateConversation(
    conversation: CommunicationSendContext["conversation"],
  ): void {
    if (conversation.channel !== this.channel) {
      throw new Error(
        "WhatsApp adapter received an incompatible conversation.",
      );
    }

    const recipients = conversation.participants.filter(
      (participant) => participant.phone,
    );

    if (recipients.length === 0) {
      throw new Error(
        "WhatsApp conversation requires at least one participant with a phone number.",
      );
    }
  }

  async send(
    context: CommunicationSendContext,
  ): Promise<CommunicationSendResult> {
    const recipients = context.conversation.participants
      .map((participant) => participant.phone)
      .filter((phone): phone is string => Boolean(phone));

    const result = await this.transport.send({
      companyId: context.companyId,
      conversationId: context.conversation.id,
      messageId: context.message.id,
      content: context.message.content,
      recipients,
    });

    return {
      externalMessageId: result.externalMessageId,
      deliveredAt: result.acceptedAt,
      metadata: {
        transport: "whatsapp",
      },
    };
  }
}
