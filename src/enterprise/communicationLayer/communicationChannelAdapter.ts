import type { CommunicationAttachment } from "./communicationAttachment";
import type {
  CommunicationChannel,
  CommunicationConversation,
  CommunicationMessage,
} from "./communicationTypes";

export interface CommunicationSendContext {
  readonly companyId: string;
  readonly conversation: CommunicationConversation;
  readonly message: CommunicationMessage;
  readonly attachments: readonly CommunicationAttachment[];
}

export interface CommunicationSendResult {
  readonly externalMessageId?: string;
  readonly deliveredAt?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}

export interface CommunicationChannelAdapter {
  readonly channel: CommunicationChannel;

  send(
    context: CommunicationSendContext,
  ): Promise<CommunicationSendResult>;

  validateConversation(
    conversation: CommunicationConversation,
  ): void;
}

export class CommunicationChannelRegistry {
  private readonly adapters = new Map<
    CommunicationChannel,
    CommunicationChannelAdapter
  >();

  register(adapter: CommunicationChannelAdapter): void {
    this.adapters.set(adapter.channel, adapter);
  }

  unregister(channel: CommunicationChannel): void {
    this.adapters.delete(channel);
  }

  get(channel: CommunicationChannel): CommunicationChannelAdapter {
    const adapter = this.adapters.get(channel);

    if (!adapter) {
      throw new Error(
        `Communication channel adapter is not registered: ${channel}`,
      );
    }

    return adapter;
  }

  has(channel: CommunicationChannel): boolean {
    return this.adapters.has(channel);
  }

  listChannels(): readonly CommunicationChannel[] {
    return [...this.adapters.keys()];
  }
}
