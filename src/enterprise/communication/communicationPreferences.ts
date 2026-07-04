import { CommunicationChannel } from "./communicationTypes";

export type CommunicationPreference = {
  recipientId: string;
  organizationId: string;
  enabledChannels: CommunicationChannel[];
  mutedChannels?: CommunicationChannel[];
  locale?: string;
};

export function canUseCommunicationChannel(
  preference: CommunicationPreference,
  channel: CommunicationChannel,
): boolean {
  if (preference.mutedChannels?.includes(channel)) {
    return false;
  }

  return preference.enabledChannels.includes(channel);
}