import type {
  CommunicationChannel,
  CommunicationDeliveryStatus,
} from "./communicationTypes";

export type CommunicationAuditAction =
  | "conversation_created"
  | "conversation_updated"
  | "message_received"
  | "message_created"
  | "message_dispatched"
  | "delivery_updated"
  | "attachment_created"
  | "webhook_received"
  | "webhook_rejected";

export interface CommunicationAuditEntry {
  readonly id: string;
  readonly companyId: string;
  readonly conversationId?: string;
  readonly messageId?: string;
  readonly action: CommunicationAuditAction;
  readonly channel?: CommunicationChannel;
  readonly deliveryStatus?: CommunicationDeliveryStatus;
  readonly actorId: string;
  readonly source: string;
  readonly details: Readonly<Record<string, unknown>>;
  readonly createdAt: string;
}

export interface CommunicationAuditWriter {
  write(entry: CommunicationAuditEntry): Promise<void>;
}

export class ConsoleCommunicationAuditWriter
  implements CommunicationAuditWriter
{
  async write(entry: CommunicationAuditEntry): Promise<void> {
    console.info("[KAFU Communication Audit]", entry);
  }
}

export function createCommunicationAuditEntry(
  input: Omit<CommunicationAuditEntry, "createdAt"> & {
    readonly createdAt?: string;
  },
): CommunicationAuditEntry {
  return {
    ...input,
    createdAt: input.createdAt ?? new Date().toISOString(),
  };
}
