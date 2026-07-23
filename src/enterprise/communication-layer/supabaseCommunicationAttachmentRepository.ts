import { supabase } from "../../../lib/supabase";

import type {
  CommunicationAttachment,
  CommunicationAttachmentStatus,
} from "./communicationModels";

import type {
  CommunicationAttachmentRepository,
  CreateAttachmentInput,
} from "./communicationAttachmentRepository";

function requireAttachment(
  attachment: CommunicationAttachment | null
): CommunicationAttachment {
  if (!attachment) {
    throw new Error("Communication attachment was not returned.");
  }

  return attachment;
}

export class SupabaseCommunicationAttachmentRepository
  implements CommunicationAttachmentRepository
{
  async createAttachment(
    input: CreateAttachmentInput
  ): Promise<CommunicationAttachment> {
    const { data, error } = await supabase
      .from("communication_attachments")
      .insert({
        company_id: input.companyId,
        conversation_id: input.conversationId,
        message_id: input.messageId ?? null,
        attachment_type: input.attachmentType,
        storage_bucket: input.storageBucket,
        storage_path: input.storagePath,
        original_file_name: input.originalFileName,
        mime_type: input.mimeType,
        file_size_bytes: input.fileSizeBytes,
        duration_seconds: input.durationSeconds ?? null,
        transcription: input.transcription?.trim() || null,
        processing_status: input.processingStatus ?? "ready",
        uploaded_by: input.uploadedBy ?? null,
        uploaded_by_name: input.uploadedByName?.trim() || null,
        metadata: input.metadata ?? {},
      })
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Unable to create communication attachment: ${error.message}`
      );
    }

    return requireAttachment(
      data as CommunicationAttachment | null
    );
  }

  async attachToMessage(
    companyId: string,
    attachmentId: string,
    messageId: string
  ): Promise<CommunicationAttachment> {
    const { data, error } = await supabase
      .from("communication_attachments")
      .update({
        message_id: messageId,
      })
      .eq("company_id", companyId)
      .eq("id", attachmentId)
      .is("deleted_at", null)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Unable to attach file to message: ${error.message}`
      );
    }

    return requireAttachment(
      data as CommunicationAttachment | null
    );
  }

  async listConversationAttachments(
    companyId: string,
    conversationId: string
  ): Promise<CommunicationAttachment[]> {
    const { data, error } = await supabase
      .from("communication_attachments")
      .select("*")
      .eq("company_id", companyId)
      .eq("conversation_id", conversationId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(
        `Unable to list conversation attachments: ${error.message}`
      );
    }

    return (data ?? []) as CommunicationAttachment[];
  }

  async listMessageAttachments(
    companyId: string,
    messageId: string
  ): Promise<CommunicationAttachment[]> {
    const { data, error } = await supabase
      .from("communication_attachments")
      .select("*")
      .eq("company_id", companyId)
      .eq("message_id", messageId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(
        `Unable to list message attachments: ${error.message}`
      );
    }

    return (data ?? []) as CommunicationAttachment[];
  }

  async updateProcessingStatus(
    companyId: string,
    attachmentId: string,
    status: CommunicationAttachmentStatus,
    transcription?: string
  ): Promise<CommunicationAttachment> {
    const updates: {
      processing_status: CommunicationAttachmentStatus;
      transcription?: string | null;
    } = {
      processing_status: status,
    };

    if (transcription !== undefined) {
      updates.transcription = transcription.trim() || null;
    }

    const { data, error } = await supabase
      .from("communication_attachments")
      .update(updates)
      .eq("company_id", companyId)
      .eq("id", attachmentId)
      .is("deleted_at", null)
      .select("*")
      .single();

    if (error) {
      throw new Error(
        `Unable to update attachment processing: ${error.message}`
      );
    }

    return requireAttachment(
      data as CommunicationAttachment | null
    );
  }

  async softDeleteAttachment(
    companyId: string,
    attachmentId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("communication_attachments")
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq("company_id", companyId)
      .eq("id", attachmentId)
      .is("deleted_at", null);

    if (error) {
      throw new Error(
        `Unable to delete communication attachment: ${error.message}`
      );
    }
  }
}

export const communicationAttachmentRepository =
  new SupabaseCommunicationAttachmentRepository();
