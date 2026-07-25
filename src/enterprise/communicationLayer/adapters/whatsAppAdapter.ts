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
    readonly externalMessageIds?: readonly string[];
    readonly acceptedAt?: string;
  }>;
}

function normalizeWhatsAppRecipients(
  context: CommunicationSendContext,
): readonly string[] {
  return [
    ...new Set(
      context.conversation.participants
        .map((participant) =>
          participant.phone
            ?.trim()
            .replace(/[^\d]/g, ""),
        )
        .filter(
          (phone): phone is string =>
            Boolean(phone),
        ),
    ),
  ];
}

export class WhatsAppAdapter
  implements CommunicationChannelAdapter
{
  readonly channel = "whatsapp" as const;

  constructor(
    private readonly transport:
      WhatsAppTransport,
  ) {}

  validateConversation(
    conversation:
      CommunicationSendContext["conversation"],
  ): void {
    if (conversation.channel !== this.channel) {
      throw new Error(
        "WhatsApp adapter received an incompatible conversation.",
      );
    }

    const recipients =
      conversation.participants
        .map((participant) =>
          participant.phone?.trim(),
        )
        .filter(Boolean);

    if (recipients.length === 0) {
      throw new Error(
        "WhatsApp conversation requires at least one participant with a phone number.",
      );
    }
  }

  async send(
    context: CommunicationSendContext,
  ): Promise<CommunicationSendResult> {
    this.validateConversation(
      context.conversation,
    );

    const recipients =
      normalizeWhatsAppRecipients(context);

    const result =
      await this.transport.send({
        companyId: context.companyId,
        conversationId:
          context.conversation.id,
        messageId: context.message.id,
        content: context.message.content,
        recipients,
      });

    const acceptedAt =
      result.acceptedAt ??
      new Date().toISOString();

    return {
      externalMessageId:
        result.externalMessageId,
      deliveredAt: acceptedAt,
      metadata: {
        transport: "whatsapp",
        provider: "meta-cloud-api",
        acceptedAt,
        recipientCount:
          recipients.length.toString(),
        providerMessageIds:
          JSON.stringify(
            result.externalMessageIds ?? [
              result.externalMessageId,
            ],
          ),
      },
    };
  }
}
