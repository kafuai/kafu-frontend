export type CommunicationAttachmentType =
  | "image"
  | "document"
  | "audio"
  | "video"
  | "archive"
  | "other";

export interface CommunicationAttachment {
  readonly id: string;
  readonly companyId: string;
  readonly conversationId: string;
  readonly messageId: string;
  readonly type: CommunicationAttachmentType;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly storagePath: string;
  readonly publicUrl?: string;
  readonly durationSeconds?: number;
  readonly createdAt: string;
  readonly createdBy: string;
}

export function createCommunicationAttachment(
  input: CommunicationAttachment,
): CommunicationAttachment {
  if (!input.fileName.trim()) {
    throw new Error("Communication attachment file name is required.");
  }

  if (input.sizeBytes < 0) {
    throw new Error("Communication attachment size cannot be negative.");
  }

  return {
    ...input,
    fileName: input.fileName.trim(),
  };
}
