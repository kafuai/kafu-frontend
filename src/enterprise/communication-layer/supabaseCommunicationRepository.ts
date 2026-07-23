import { supabase } from "../../../lib/supabase";

import type {
  CommunicationConversation,
  CommunicationMessage,
} from "./communicationModels";

import type {
  CommunicationRepository,
  CreateConversationInput,
  CreateMessageInput,
} from "./communicationRepository";

function requireValue<T>(value: T | null, message: string): T {
  if (value === null) {
    throw new Error(message);
  }

  return value;
}

export class SupabaseCommunicationRepository
  implements CommunicationRepository
{
  async createConversation(
    input: CreateConversationInput
  ): Promise<CommunicationConversation> {
    const { data, error } = await supabase
      .from("communication_conversations")
      .insert({
        company_id: input.companyId,
        conversation_type:
          input.conversationType ?? "corporate_brain",
        channel: input.channel ?? "platform",
        title: input.title?.trim() || null,
        created_by: input.createdBy ?? null,
        created_by_name: input.createdByName?.trim() || null,
        metadata: input.metadata ?? {},
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Unable to create communication conversation: ${error.message}`
      );
    }

    return requireValue(
      data as CommunicationConversation | null,
      "Communication conversation was not returned."
    );
  }

  async getConversation(
    companyId: string,
    conversationId: string
  ): Promise<CommunicationConversation | null> {
    const { data, error } = await supabase
      .from("communication_conversations")
      .select("*")
      .eq("company_id", companyId)
      .eq("id", conversationId)
      .is("deleted_at", null)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Unable to load communication conversation: ${error.message}`
      );
    }

    return data as CommunicationConversation | null;
  }

  async listConversations(
    companyId: string
  ): Promise<CommunicationConversation[]> {
    const { data, error } = await supabase
      .from("communication_conversations")
      .select("*")
      .eq("company_id", companyId)
      .is("deleted_at", null)
      .order("last_message_at", {
        ascending: false,
        nullsFirst: false,
      })
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(
        `Unable to list communication conversations: ${error.message}`
      );
    }

    return (data ?? []) as CommunicationConversation[];
  }

  async createMessage(
    input: CreateMessageInput
  ): Promise<CommunicationMessage> {
    const normalizedContent = input.content?.trim() || null;
    const messageType = input.messageType ?? "text";

    if (messageType === "text" && !normalizedContent) {
      throw new Error("Text messages require content.");
    }

    const { data, error } = await supabase
      .from("communication_messages")
      .insert({
        company_id: input.companyId,
        conversation_id: input.conversationId,
        parent_message_id: input.parentMessageId ?? null,
        sender_type: input.senderType,
        sender_id: input.senderId ?? null,
        sender_name: input.senderName?.trim() || null,
        message_type: messageType,
        content: normalizedContent,
        delivery_status: "sent",
        metadata: input.metadata ?? {},
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Unable to create communication message: ${error.message}`
      );
    }

    return requireValue(
      data as CommunicationMessage | null,
      "Communication message was not returned."
    );
  }

  async listMessages(
    companyId: string,
    conversationId: string
  ): Promise<CommunicationMessage[]> {
    const { data, error } = await supabase
      .from("communication_messages")
      .select("*")
      .eq("company_id", companyId)
      .eq("conversation_id", conversationId)
      .is("deleted_at", null)
      .order("sent_at", { ascending: true });

    if (error) {
      throw new Error(
        `Unable to list communication messages: ${error.message}`
      );
    }

    return (data ?? []) as CommunicationMessage[];
  }
}

export const communicationRepository =
  new SupabaseCommunicationRepository();
