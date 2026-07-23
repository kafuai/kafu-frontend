import type {
  CommunicationAttachment,
  CommunicationAttachmentStatus,
  CommunicationAttachmentType,
  CommunicationMetadata,
} from "./communicationModels";

export interface CreateAttachmentInput {
  companyId: string;
  conversationId: string;
  messageId?: string;
  attachmentType: CommunicationAttachmentType;
  storageBucket: string;
  storagePath: string;
  originalFileName: string;
  mimeType: string;
  fileSizeBytes: number;
  durationSeconds?: number;
  transcription?: string;
  processingStatus?: CommunicationAttachmentStatus;
  uploadedBy?: string;
  uploadedByName?: string;
  metadata?: CommunicationMetadata;
}

export interface CommunicationAttachmentRepository {
  createAttachment(
    input: CreateAttachmentInput
  ): Promise<CommunicationAttachment>;

  attachToMessage(
    companyId: string,
    attachmentId: string,
    messageId: string
  ): Promise<CommunicationAttachment>;

  listConversationAttachments(
    companyId: string,
    conversationId: string
  ): Promise<CommunicationAttachment[]>;

  listMessageAttachments(
    companyId: string,
    messageId: string
  ): Promise<CommunicationAttachment[]>;

  updateProcessingStatus(
    companyId: string,
    attachmentId: string,
    status: CommunicationAttachmentStatus,
    transcription?: string
  ): Promise<CommunicationAttachment>;

  softDeleteAttachment(
    companyId: string,
    attachmentId: string
  ): Promise<void>;
}
