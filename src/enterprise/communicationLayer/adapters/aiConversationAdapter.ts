import type {
  CommunicationChannelAdapter,
  CommunicationSendContext,
  CommunicationSendResult,
} from "../communicationChannelAdapter";

export class AIConversationAdapter
  implements CommunicationChannelAdapter
{
  readonly channel = "web" as const;

  validateConversation(
    conversation: CommunicationSendContext["conversation"],
  ): void {
    if (conversation.channel !== this.channel) {
      throw new Error(
        "AI conversation adapter received an incompatible conversation.",
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
        transport: "conversation-engine",
        mode: "ai",
      },
    };
  }
}
