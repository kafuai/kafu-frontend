import type {
  CommunicationChannelAdapter,
  CommunicationSendContext,
  CommunicationSendResult,
} from "../communicationChannelAdapter";

export interface VoiceTransport {
  send(input: {
    readonly companyId: string;
    readonly conversationId: string;
    readonly messageId: string;
    readonly recipientIds: readonly string[];
    readonly audioStoragePaths: readonly string[];
    readonly transcript?: string;
  }): Promise<{
    readonly externalMessageId: string;
    readonly acceptedAt?: string;
  }>;
}

export class VoiceAdapter implements CommunicationChannelAdapter {
  readonly channel = "voice" as const;

  constructor(
    private readonly transport: VoiceTransport,
  ) {}

  validateConversation(
    conversation: CommunicationSendContext["conversation"],
  ): void {
    if (conversation.channel !== this.channel) {
      throw new Error(
        "Voice adapter received an incompatible conversation.",
      );
    }

    if (conversation.participants.length === 0) {
      throw new Error(
        "Voice conversation requires at least one participant.",
      );
    }
  }

  async send(
    context: CommunicationSendContext,
  ): Promise<CommunicationSendResult> {
    const audioAttachments = context.attachments.filter(
      (attachment) => attachment.type === "audio",
    );

    if (audioAttachments.length === 0) {
      throw new Error(
        "Voice communication requires at least one audio attachment.",
      );
    }

    const result = await this.transport.send({
      companyId: context.companyId,
      conversationId: context.conversation.id,
      messageId: context.message.id,
      recipientIds: context.conversation.participants.map(
        (participant) => participant.id,
      ),
      audioStoragePaths: audioAttachments.map(
        (attachment) => attachment.storagePath,
      ),
      transcript:
        context.message.content.trim() || undefined,
    });

    return {
      externalMessageId: result.externalMessageId,
      deliveredAt: result.acceptedAt,
      metadata: {
        transport: "voice",
      },
    };
  }
}
