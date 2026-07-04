import { CommunicationChannel, CommunicationStatus } from "./communicationTypes";

export type CommunicationDeliveryRecord = {
  messageId: string;
  organizationId: string;
  channel: CommunicationChannel;
  status: CommunicationStatus;
  provider?: string;
  error?: string;
  attemptedAt: Date;
};

export function createCommunicationDeliveryRecord(
  input: Omit<CommunicationDeliveryRecord, "attemptedAt">,
): CommunicationDeliveryRecord {
  return {
    ...input,
    attemptedAt: new Date(),
  };
}