export type CommunicationConversationType =
  | "corporate_brain"
  | "employee"
  | "team"
  | "customer"
  | "sales"
  | "support"
  | "system";

export type CommunicationChannel =
  | "platform"
  | "email"
  | "whatsapp"
  | "voice"
  | "api"
  | "system";

export type CommunicationConversationStatus =
  | "active"
  | "resolved"
  | "archived";

export type CommunicationParticipantType =
  | "user"
  | "employee"
  | "customer"
  | "ai_agent"
  | "corporate_brain"
  | "system";

export type CommunicationMessageType =
  | "text"
  | "voice"
  | "file"
  | "image"
  | "system"
  | "event";

export type CommunicationDeliveryStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export type CommunicationAttachmentType =
  | "document"
  | "image"
  | "audio"
  | "video"
  | "archive"
  | "other";

export type CommunicationAttachmentStatus =
  | "uploading"
  | "processing"
  | "ready"
  | "failed";

export type CommunicationMetadata = Record<string, unknown>;

export interface CommunicationConversation {
  id: string;
  company_id: string;
  conversation_type: CommunicationConversationType;
  channel: CommunicationChannel;
  title: string | null;
  status: CommunicationConversationStatus;
  created_by: string | null;
  created_by_name: string | null;
  last_message_at: string | null;
  metadata: CommunicationMetadata;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface CommunicationParticipant {
  id: string;
  company_id: string;
  conversation_id: string;
  participant_type: CommunicationParticipantType;
  participant_id: string | null;
  display_name: string | null;
  email: string | null;
  role: "owner" | "member" | "observer" | "assistant";
  joined_at: string;
  left_at: string | null;
  metadata: CommunicationMetadata;
  created_at: string;
}

export interface CommunicationMessage {
  id: string;
  company_id: string;
  conversation_id: string;
  parent_message_id: string | null;
  sender_type: CommunicationParticipantType;
  sender_id: string | null;
  sender_name: string | null;
  message_type: CommunicationMessageType;
  content: string | null;
  delivery_status: CommunicationDeliveryStatus;
  external_message_id: string | null;
  reply_to_external_id: string | null;
  metadata: CommunicationMetadata;
  sent_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommunicationAttachment {
  id: string;
  company_id: string;
  conversation_id: string;
  message_id: string | null;
  attachment_type: CommunicationAttachmentType;
  storage_bucket: string;
  storage_path: string;
  original_file_name: string;
  mime_type: string;
  file_size_bytes: number;
  duration_seconds: number | null;
  transcription: string | null;
  processing_status: CommunicationAttachmentStatus;
  uploaded_by: string | null;
  uploaded_by_name: string | null;
  metadata: CommunicationMetadata;
  created_at: string;
  deleted_at: string | null;
}
