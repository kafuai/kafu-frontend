import {
  CommunicationChannelRegistry,
  type CommunicationChannelAdapter,
} from "./communicationChannelAdapter";
import { CommunicationService } from "./communicationService";
import {
  communicationRepository,
} from "./supabaseCommunicationRepository";
import type {
  CommunicationChannel,
  CommunicationMessage,
} from "./communicationTypes";
import type {
  SendCommunicationMessageInput,
} from "./communicationService";

export class CommunicationRuntime {
  readonly channels: CommunicationChannelRegistry;
  readonly service: CommunicationService;

  constructor(input?: {
    readonly service?: CommunicationService;
    readonly adapters?: readonly CommunicationChannelAdapter[];
  }) {
    this.service =
      input?.service ??
      new CommunicationService(communicationRepository);

    this.channels = new CommunicationChannelRegistry();

    for (const adapter of input?.adapters ?? []) {
      this.channels.register(adapter);
    }
  }

  registerChannel(adapter: CommunicationChannelAdapter): void {
    this.channels.register(adapter);
  }

  supportsChannel(channel: CommunicationChannel): boolean {
    return this.channels.has(channel);
  }

  async send(
    input: SendCommunicationMessageInput,
  ): Promise<CommunicationMessage> {
    const conversation = await this.service.getConversation(
      input.companyId,
      input.conversationId,
    );

    const adapter = this.channels.get(conversation.channel);

    return this.service.dispatchMessage(input, adapter);
  }
}

export const communicationRuntime = new CommunicationRuntime();
