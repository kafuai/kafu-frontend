import type {
  CommunicationChannelAdapter,
  CommunicationSendContext,
  CommunicationSendResult,
} from "../communicationChannelAdapter";

export class InternalChatAdapter
  implements CommunicationChannelAdapter
{
  readonly channel = "internal_chat" as const;

  validateConversation(
    context: CommunicationSendContext["conversation"],
  ): void {
    if (context.channel !== this.channel) {
      throw new Error(
        "Internal chat adapter received an incompatible conversation.",
      );
    }

    if (context.participants.length === 0) {
      throw new Error(
        "Internal chat conversation requires at least one participant.",
      );
    }
  }

  async send(
    context: CommunicationSendContext,
  ): Promise<CommunicationSendResult> {
    return {
      externalMessageId: context.message.id,
      deliveredAt: new Date().toISOString(),
      metadata: {
        transport: "internal",
      },
    };
  }
}
