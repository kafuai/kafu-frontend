import { supabase } from "../../../lib/supabase";

import type {
  CommunicationAuditEntry,
  CommunicationAuditWriter,
} from "./communicationAudit";

interface CommunicationAuditRow {
  id: string;
  company_id: string;
  conversation_id: string | null;
  message_id: string | null;
  action: CommunicationAuditEntry["action"];
  channel: CommunicationAuditEntry["channel"] | null;
  delivery_status:
    | CommunicationAuditEntry["deliveryStatus"]
    | null;
  actor_id: string;
  source: string;
  details: Readonly<Record<string, unknown>>;
  created_at: string;
}

function toAuditRow(
  entry: CommunicationAuditEntry,
): CommunicationAuditRow {
  return {
    id: entry.id,
    company_id: entry.companyId,
    conversation_id: entry.conversationId ?? null,
    message_id: entry.messageId ?? null,
    action: entry.action,
    channel: entry.channel ?? null,
    delivery_status: entry.deliveryStatus ?? null,
    actor_id: entry.actorId,
    source: entry.source,
    details: entry.details,
    created_at: entry.createdAt,
  };
}

export class SupabaseCommunicationAuditWriter
  implements CommunicationAuditWriter
{
  async write(entry: CommunicationAuditEntry): Promise<void> {
    const { error } = await supabase
      .from("communication_audit_log")
      .insert(toAuditRow(entry));

    if (error) {
      throw new Error(
        `Communication audit write failed: ${error.message}`,
      );
    }
  }
}

export const communicationAuditWriter =
  new SupabaseCommunicationAuditWriter();
