import { supabase } from "../../../lib/supabase";

import type { CommunicationAttachment } from "./communicationAttachment";
import {
  fromAttachmentRow,
  fromConversationRow,
  fromMessageRow,
  toAttachmentRow,
  toConversationRow,
  toMessageRow,
  type CommunicationAttachmentRow,
  type CommunicationConversationRow,
  type CommunicationMessageRow,
} from "./communicationMappers";
import type {
  CommunicationConversationQuery,
  CommunicationMessageQuery,
  CommunicationRepository,
} from "./communicationRepository";
import type {
  CommunicationConversation,
  CommunicationDeliveryStatus,
  CommunicationMessage,
} from "./communicationTypes";

const CONVERSATIONS_TABLE = "communication_conversations";
const MESSAGES_TABLE = "communication_messages";
const ATTACHMENTS_TABLE = "communication_attachments";

function throwRepositoryError(
  operation: string,
  error: { message: string } | null,
): never {
  throw new Error(
    `Communication repository failed to ${operation}: ${
      error?.message ?? "Unknown database error"
    }`,
  );
}

export class SupabaseCommunicationRepository
  implements CommunicationRepository
{
  async createConversation(
    conversation: CommunicationConversation,
  ): Promise<CommunicationConversation> {
    const { data, error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .insert(toConversationRow(conversation))
      .select("*")
      .single();

    if (error || !data) {
      return throwRepositoryError("create conversation", error);
    }

    return fromConversationRow(data as CommunicationConversationRow);
  }

  async updateConversation(
    conversation: CommunicationConversation,
  ): Promise<CommunicationConversation> {
    const row = toConversationRow(conversation);

    const { data, error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .update({
        subject: row.subject,
        channel: row.channel,
        status: row.status,
        priority: row.priority,
        participants: row.participants,
        tags: row.tags,
        external_reference_id: row.external_reference_id,
        last_message_at: row.last_message_at,
        updated_at: row.updated_at,
      })
      .eq("id", row.id)
      .eq("company_id", row.company_id)
      .select("*")
      .single();

    if (error || !data) {
      return throwRepositoryError("update conversation", error);
    }

    return fromConversationRow(data as CommunicationConversationRow);
  }

  async findConversationById(
    companyId: string,
    conversationId: string,
  ): Promise<CommunicationConversation | null> {
    const { data, error } = await supabase
      .from(CONVERSATIONS_TABLE)
      .select("*")
      .eq("company_id", companyId)
      .eq("id", conversationId)
      .maybeSingle();

    if (error) {
      return throwRepositoryError("find conversation", error);
    }

    return data
      ? fromConversationRow(data as CommunicationConversationRow)
      : null;
  }

  async listConversations(
    query: CommunicationConversationQuery,
  ): Promise<readonly CommunicationConversation[]> {
    let request = supabase
      .from(CONVERSATIONS_TABLE)
      .select("*")
      .eq("company_id", query.companyId)
      .order("last_message_at", {
        ascending: false,
        nullsFirst: false,
      })
      .limit(query.limit ?? 50);

    if (query.channel) {
      request = request.eq("channel", query.channel);
    }

    if (query.status) {
      request = request.eq("status", query.status);
    }

    const { data, error } = await request;

    if (error) {
      return throwRepositoryError("list conversations", error);
    }

    return (data ?? []).map((row) =>
      fromConversationRow(row as CommunicationConversationRow),
    );
  }

  async createMessage(
    companyId: string,
    message: CommunicationMessage,
  ): Promise<CommunicationMessage> {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .insert(toMessageRow(companyId, message))
      .select("*")
      .single();

    if (error || !data) {
      return throwRepositoryError("create message", error);
    }

    return fromMessageRow(data as CommunicationMessageRow);
  }

  async updateMessageDeliveryStatus(
    companyId: string,
    messageId: string,
    status: CommunicationDeliveryStatus,
    errorMessage?: string,
  ): Promise<CommunicationMessage> {
    const updatedAt = new Date().toISOString();

    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .update({
        delivery_status: status,
        error_message: errorMessage ?? null,
        updated_at: updatedAt,
      })
      .eq("company_id", companyId)
      .eq("id", messageId)
      .select("*")
      .single();

    if (error || !data) {
      return throwRepositoryError("update message delivery status", error);
    }

    return fromMessageRow(data as CommunicationMessageRow);
  }

  async listMessages(
    query: CommunicationMessageQuery,
  ): Promise<readonly CommunicationMessage[]> {
    const { data, error } = await supabase
      .from(MESSAGES_TABLE)
      .select("*")
      .eq("company_id", query.companyId)
      .eq("conversation_id", query.conversationId)
      .order("created_at", { ascending: true })
      .limit(query.limit ?? 200);

    if (error) {
      return throwRepositoryError("list messages", error);
    }

    return (data ?? []).map((row) =>
      fromMessageRow(row as CommunicationMessageRow),
    );
  }

  async createAttachment(
    attachment: CommunicationAttachment,
  ): Promise<CommunicationAttachment> {
    const { data, error } = await supabase
      .from(ATTACHMENTS_TABLE)
      .insert(toAttachmentRow(attachment))
      .select("*")
      .single();

    if (error || !data) {
      return throwRepositoryError("create attachment", error);
    }

    return fromAttachmentRow(data as CommunicationAttachmentRow);
  }

  async listAttachments(
    companyId: string,
    messageId: string,
  ): Promise<readonly CommunicationAttachment[]> {
    const { data, error } = await supabase
      .from(ATTACHMENTS_TABLE)
      .select("*")
      .eq("company_id", companyId)
      .eq("message_id", messageId)
      .order("created_at", { ascending: true });

    if (error) {
      return throwRepositoryError("list attachments", error);
    }

    return (data ?? []).map((row) =>
      fromAttachmentRow(row as CommunicationAttachmentRow),
    );
  }
}

export const communicationRepository =
  new SupabaseCommunicationRepository();
