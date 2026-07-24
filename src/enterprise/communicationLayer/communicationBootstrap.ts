import {
  AIConversationAdapter,
  EmailAdapter,
  InternalChatAdapter,
  VoiceAdapter,
  WhatsAppAdapter,
  type EmailTransport,
  type VoiceTransport,
  type WhatsAppTransport,
} from "./adapters";
import {
  CommunicationRuntime,
  communicationRuntime,
} from "./communicationRuntime";

export interface CommunicationTransports {
  readonly email?: EmailTransport;
  readonly whatsapp?: WhatsAppTransport;
  readonly voice?: VoiceTransport;
}

export function registerCommunicationChannels(
  runtime: CommunicationRuntime,
  transports: CommunicationTransports = {},
): CommunicationRuntime {
  runtime.registerChannel(new InternalChatAdapter());
  runtime.registerChannel(new AIConversationAdapter());

  if (transports.email) {
    runtime.registerChannel(
      new EmailAdapter(transports.email),
    );
  }

  if (transports.whatsapp) {
    runtime.registerChannel(
      new WhatsAppAdapter(transports.whatsapp),
    );
  }

  if (transports.voice) {
    runtime.registerChannel(
      new VoiceAdapter(transports.voice),
    );
  }

  return runtime;
}

export function bootstrapCommunicationRuntime(
  transports: CommunicationTransports = {},
): CommunicationRuntime {
  return registerCommunicationChannels(
    communicationRuntime,
    transports,
  );
}
