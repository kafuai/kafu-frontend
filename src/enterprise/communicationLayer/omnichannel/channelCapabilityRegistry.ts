import type {
  CommunicationChannel,
} from "../communicationTypes";

import type {
  OmnichannelCapability,
} from "./omnichannelModels";

export interface ChannelCapabilityDefinition {
  readonly channel: CommunicationChannel;
  readonly capabilities: readonly OmnichannelCapability[];
}

export class ChannelCapabilityRegistry {
  private readonly definitions =
    new Map<CommunicationChannel, ReadonlySet<OmnichannelCapability>>();

  register(
    definition: ChannelCapabilityDefinition,
  ): void {
    if (definition.capabilities.length === 0) {
      throw new Error(
        `Communication channel "${definition.channel}" requires at least one capability.`,
      );
    }

    this.definitions.set(
      definition.channel,
      new Set(definition.capabilities),
    );
  }

  unregister(
    channel: CommunicationChannel,
  ): void {
    this.definitions.delete(channel);
  }

  has(
    channel: CommunicationChannel,
    capability: OmnichannelCapability,
  ): boolean {
    return this.definitions
      .get(channel)
      ?.has(capability) ?? false;
  }

  supportsAll(
    channel: CommunicationChannel,
    requiredCapabilities:
      readonly OmnichannelCapability[],
  ): boolean {
    const registered =
      this.definitions.get(channel);

    if (!registered) {
      return false;
    }

    return requiredCapabilities.every(
      (capability) => registered.has(capability),
    );
  }

  get(
    channel: CommunicationChannel,
  ): readonly OmnichannelCapability[] {
    return [
      ...(this.definitions.get(channel) ?? []),
    ];
  }

  list():
    readonly ChannelCapabilityDefinition[] {
    return [...this.definitions.entries()]
      .map(([channel, capabilities]) => ({
        channel,
        capabilities: [...capabilities],
      }));
  }
}

export function createDefaultChannelCapabilityRegistry():
  ChannelCapabilityRegistry {
  const registry =
    new ChannelCapabilityRegistry();

  registry.register({
    channel: "internal_chat",
    capabilities: [
      "text",
      "attachments",
      "images",
      "documents",
      "audio",
      "delivery_receipts",
      "read_receipts",
      "typing_indicators",
      "reactions",
      "threading",
      "inbound",
      "outbound",
    ],
  });

  registry.register({
    channel: "web",
    capabilities: [
      "text",
      "attachments",
      "images",
      "documents",
      "audio",
      "delivery_receipts",
      "read_receipts",
      "typing_indicators",
      "threading",
      "inbound",
      "outbound",
      "ai_generated",
    ],
  });

  registry.register({
    channel: "email",
    capabilities: [
      "text",
      "html",
      "attachments",
      "images",
      "documents",
      "delivery_receipts",
      "threading",
      "inbound",
      "outbound",
    ],
  });

  registry.register({
    channel: "whatsapp",
    capabilities: [
      "text",
      "attachments",
      "images",
      "documents",
      "audio",
      "templates",
      "interactive",
      "delivery_receipts",
      "read_receipts",
      "inbound",
      "outbound",
    ],
  });

  registry.register({
    channel: "voice",
    capabilities: [
      "audio",
      "attachments",
      "delivery_receipts",
      "inbound",
      "outbound",
    ],
  });

  return registry;
}
