import type {
  CommunicationChannelAdapter,
  CommunicationSendContext,
  CommunicationSendResult,
} from "../communicationChannelAdapter";

export interface EmailTransport {
  send(input: {
    readonly companyId: string;
    readonly conversationId: string;
    readonly messageId: string;
    readonly subject?: string;
    readonly content: string;
    readonly recipients: readonly string[];
  }): Promise<{
    readonly externalMessageId: string;
    readonly acceptedAt?: string;
  }>;
}

export class EmailAdapter implements CommunicationChannelAdapter {
  readonly channel = "email" as const;

  constructor(
    private readonly transport: EmailTransport,
  ) {}

  validateConversation(
    conversation: CommunicationSendContext["conversation"],
  ): void {
    if (conversation.channel !== this.channel) {
      throw new Error(
        "Email adapter received an incompatible conversation.",
      );
    }

    const recipients = conversation.participants.filter(
      (participant) => participant.email,
    );

    if (recipients.length === 0) {
      throw new Error(
        "Email conversation requires at least one participant with an email address.",
      );
    }
  }

  async send(
    context: CommunicationSendContext,
  ): Promise<CommunicationSendResult> {
    const recipients = context.conversation.participants
      .map((participant) => participant.email)
      .filter((email): email is string => Boolean(email));

    const result = await this.transport.send({
      companyId: context.companyId,
      conversationId: context.conversation.id,
      messageId: context.message.id,
      subject: context.conversation.subject,
      content: context.message.content,
      recipients,
    });

    return {
      externalMessageId: result.externalMessageId,
      deliveredAt: result.acceptedAt,
      metadata: {
        transport: "email",
      },
    };
  }
}
