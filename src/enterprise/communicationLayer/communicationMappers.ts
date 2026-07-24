import type { CommunicationAttachment } from "./communicationAttachment";
import type {
  CommunicationConversation,
  CommunicationMessage,
  CommunicationParticipant,
} from "./communicationTypes";

export interface CommunicationConversationRow {
  id: string;
  company_id: string;
  tenant_id: string;
  organization_id: string;
  subject: string | null;
  channel: CommunicationConversation["channel"];
  status: CommunicationConversation["status"];
  priority: CommunicationConversation["priority"];
  participants: CommunicationParticipant[];
  tags: string[];
  created_by: string;
  external_reference_id: string | null;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunicationMessageRow {
  id: string;
  company_id: string;
  conversation_id: string;
  sender_id: string;
  channel: CommunicationMessage["channel"];
  direction: CommunicationMessage["direction"];
  message_type: CommunicationMessage["type"];
  content: string;
  delivery_status: CommunicationMessage["deliveryStatus"];
  reply_to_message_id: string | null;
  external_message_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunicationAttachmentRow {
  id: string;
  company_id: string;
  conversation_id: string;
  message_id: string;
  attachment_type: CommunicationAttachment["type"];
  file_name: string;
  mime_type: string;
  size_bytes: number;
  storage_path: string;
  public_url: string | null;
  duration_seconds: number | null;
  created_by: string;
  created_at: string;
}

export function toConversationRow(
  conversation: CommunicationConversation,
): CommunicationConversationRow {
  return {
    id: conversation.id,
    company_id: conversation.metadata.companyId,
    tenant_id: conversation.metadata.tenantId,
    organization_id: conversation.metadata.organizationId,
    subject: conversation.subject ?? null,
    channel: conversation.channel,
    status: conversation.status,
    priority: conversation.priority,
    participants: [...conversation.participants],
    tags: [...conversation.metadata.tags],
    created_by: conversation.metadata.createdBy,
    external_reference_id: conversation.externalReferenceId ?? null,
    last_message_at: conversation.lastMessageAt ?? null,
    created_at: conversation.metadata.createdAt,
    updated_at: conversation.metadata.updatedAt,
  };
}

export function fromConversationRow(
  row: CommunicationConversationRow,
): CommunicationConversation {
  return {
    id: row.id,
    subject: row.subject ?? undefined,
    channel: row.channel,
    status: row.status,
    priority: row.priority,
    participants: row.participants ?? [],
    externalReferenceId: row.external_reference_id ?? undefined,
    lastMessageAt: row.last_message_at ?? undefined,
    metadata: {
      companyId: row.company_id,
      tenantId: row.tenant_id,
      organizationId: row.organization_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      createdBy: row.created_by,
      tags: row.tags ?? [],
    },
  };
}

export function toMessageRow(
  companyId: string,
  message: CommunicationMessage,
): CommunicationMessageRow {
  return {
    id: message.id,
    company_id: companyId,
    conversation_id: message.conversationId,
    sender_id: message.senderId,
    channel: message.channel,
    direction: message.direction,
    message_type: message.type,
    content: message.content,
    delivery_status: message.deliveryStatus,
    reply_to_message_id: message.replyToMessageId ?? null,
    external_message_id: message.externalMessageId ?? null,
    error_message: message.errorMessage ?? null,
    created_at: message.createdAt,
    updated_at: message.updatedAt,
  };
}

export function fromMessageRow(
  row: CommunicationMessageRow,
): CommunicationMessage {
  return {
    id: row.id,
    conversationId: row.conversation_id,
    senderId: row.sender_id,
    channel: row.channel,
    direction: row.direction,
    type: row.message_type,
    content: row.content,
    deliveryStatus: row.delivery_status,
    replyToMessageId: row.reply_to_message_id ?? undefined,
    externalMessageId: row.external_message_id ?? undefined,
    errorMessage: row.error_message ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function toAttachmentRow(
  attachment: CommunicationAttachment,
): CommunicationAttachmentRow {
  return {
    id: attachment.id,
    company_id: attachment.companyId,
    conversation_id: attachment.conversationId,
    message_id: attachment.messageId,
    attachment_type: attachment.type,
    file_name: attachment.fileName,
    mime_type: attachment.mimeType,
    size_bytes: attachment.sizeBytes,
    storage_path: attachment.storagePath,
    public_url: attachment.publicUrl ?? null,
    duration_seconds: attachment.durationSeconds ?? null,
    created_by: attachment.createdBy,
    created_at: attachment.createdAt,
  };
}

export function fromAttachmentRow(
  row: CommunicationAttachmentRow,
): CommunicationAttachment {
  return {
    id: row.id,
    companyId: row.company_id,
    conversationId: row.conversation_id,
    messageId: row.message_id,
    type: row.attachment_type,
    fileName: row.file_name,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    storagePath: row.storage_path,
    publicUrl: row.public_url ?? undefined,
    durationSeconds: row.duration_seconds ?? undefined,
    createdBy: row.created_by,
    createdAt: row.created_at,
  };
}
