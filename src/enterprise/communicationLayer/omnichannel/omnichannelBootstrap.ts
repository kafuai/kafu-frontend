import {
  AIConversationAdapter,
  EmailAdapter,
  InternalChatAdapter,
  VoiceAdapter,
  WhatsAppAdapter,
  type EmailTransport,
  type VoiceTransport,
  type WhatsAppTransport,
} from "../adapters";

import {
  OmnichannelRuntime,
  omnichannelRuntime,
} from "./omnichannelRuntime";

export interface OmnichannelTransports {
  readonly email?: EmailTransport;
  readonly whatsapp?: WhatsAppTransport;
  readonly voice?: VoiceTransport;
}

export interface OmnichannelProviderIds {
  readonly internalChat?: string;
  readonly aiConversation?: string;
  readonly email?: string;
  readonly whatsapp?: string;
  readonly voice?: string;
}

export interface OmnichannelBootstrapOptions {
  readonly transports?:
    OmnichannelTransports;
  readonly providerIds?:
    OmnichannelProviderIds;
}

export function registerDefaultOmnichannelProviders(
  runtime: OmnichannelRuntime,
  options: OmnichannelBootstrapOptions = {},
): OmnichannelRuntime {
  const transports =
    options.transports ?? {};

  const providerIds =
    options.providerIds ?? {};

  runtime.registerProvider({
    id:
      providerIds.internalChat ??
      "kafu-internal-chat",
    displayName:
      "KAFU Internal Chat",
    adapter:
      new InternalChatAdapter(),
    priority: 10,
    metadata: {
      providerType: "internal",
      managedBy: "kafu",
    },
  });

  runtime.registerProvider({
    id:
      providerIds.aiConversation ??
      "kafu-ai-conversation",
    displayName:
      "KAFU AI Conversation Engine",
    adapter:
      new AIConversationAdapter(),
    priority: 10,
    metadata: {
      providerType: "ai",
      managedBy: "kafu",
    },
  });

  if (transports.email) {
    runtime.registerProvider({
      id:
        providerIds.email ??
        "primary-email-provider",
      displayName:
        "Primary Email Provider",
      adapter:
        new EmailAdapter(
          transports.email,
        ),
      priority: 10,
      metadata: {
        providerType: "email",
      },
    });
  }

  if (transports.whatsapp) {
    runtime.registerProvider({
      id:
        providerIds.whatsapp ??
        "primary-whatsapp-provider",
      displayName:
        "Primary WhatsApp Provider",
      adapter:
        new WhatsAppAdapter(
          transports.whatsapp,
        ),
      priority: 10,
      metadata: {
        providerType: "whatsapp",
      },
    });
  }

  if (transports.voice) {
    runtime.registerProvider({
      id:
        providerIds.voice ??
        "primary-voice-provider",
      displayName:
        "Primary Voice Provider",
      adapter:
        new VoiceAdapter(
          transports.voice,
        ),
      priority: 10,
      metadata: {
        providerType: "voice",
      },
    });
  }

  return runtime;
}

export function bootstrapOmnichannelRuntime(
  options: OmnichannelBootstrapOptions = {},
): OmnichannelRuntime {
  return registerDefaultOmnichannelProviders(
    omnichannelRuntime,
    options,
  );
}
