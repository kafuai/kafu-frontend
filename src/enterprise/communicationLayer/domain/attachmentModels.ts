import {
  assertCommunicationTenantScope,
  type CommunicationAttributes,
  type CommunicationDomainMetadata,
  type CommunicationId,
  type CommunicationTimestamp,
} from "./communicationTypes";

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
  | "failed"
  | "deleted";

export interface CommunicationAttachmentStorage {
  readonly bucket: string;
  readonly path: string;
  readonly publicUrl?: string;
  readonly checksum?: string;
}

export interface CommunicationAttachmentMedia {
  readonly width?: number;
  readonly height?: number;
  readonly durationSeconds?: number;
  readonly transcription?: string;
  readonly thumbnailUrl?: string;
}

export interface CommunicationAttachment {
  readonly id: CommunicationId;
  readonly conversationId: CommunicationId;
  readonly messageId?: CommunicationId;
  readonly type: CommunicationAttachmentType;
  readonly status: CommunicationAttachmentStatus;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly storage: CommunicationAttachmentStorage;
  readonly media?: CommunicationAttachmentMedia;
  readonly metadata: CommunicationDomainMetadata;
  readonly uploadedBy?: CommunicationId;
  readonly deletedAt?: CommunicationTimestamp;
  readonly attributes?: CommunicationAttributes;
}

export interface CreateCommunicationAttachmentInput {
  readonly id: CommunicationId;
  readonly conversationId: CommunicationId;
  readonly messageId?: CommunicationId;
  readonly type: CommunicationAttachmentType;
  readonly status?: CommunicationAttachmentStatus;
  readonly fileName: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly storage: CommunicationAttachmentStorage;
  readonly media?: CommunicationAttachmentMedia;
  readonly metadata: CommunicationDomainMetadata;
  readonly uploadedBy?: CommunicationId;
  readonly attributes?: CommunicationAttributes;
}

export interface UpdateCommunicationAttachmentInput {
  readonly messageId?: CommunicationId;
  readonly status?: CommunicationAttachmentStatus;
  readonly publicUrl?: string;
  readonly checksum?: string;
  readonly media?: CommunicationAttachmentMedia;
  readonly deletedAt?: CommunicationTimestamp;
  readonly updatedAt?: CommunicationTimestamp;
  readonly updatedBy?: CommunicationId;
  readonly attributes?: CommunicationAttributes;
}

export function createCommunicationAttachment(
  input: CreateCommunicationAttachmentInput,
): CommunicationAttachment {
  assertCommunicationTenantScope(input.metadata);

  if (!input.id.trim()) {
    throw new Error("Communication attachment id is required.");
  }

  if (!input.conversationId.trim()) {
    throw new Error(
      "Communication attachment conversation id is required.",
    );
  }

  const fileName = input.fileName.trim();
  const mimeType = input.mimeType.trim();
  const bucket = input.storage.bucket.trim();
  const path = input.storage.path.trim();

  if (!fileName) {
    throw new Error(
      "Communication attachment file name is required.",
    );
  }

  if (!mimeType) {
    throw new Error(
      "Communication attachment MIME type is required.",
    );
  }

  if (input.sizeBytes < 0) {
    throw new Error(
      "Communication attachment size cannot be negative.",
    );
  }

  if (!bucket || !path) {
    throw new Error(
      "Communication attachment storage location is required.",
    );
  }

  return {
    id: input.id,
    conversationId: input.conversationId,
    messageId: input.messageId,
    type: input.type,
    status: input.status ?? "uploading",
    fileName,
    mimeType,
    sizeBytes: input.sizeBytes,
    storage: {
      ...input.storage,
      bucket,
      path,
    },
    media: input.media,
    metadata: input.metadata,
    uploadedBy: input.uploadedBy,
    attributes: input.attributes,
  };
}

export function updateCommunicationAttachment(
  attachment: CommunicationAttachment,
  input: UpdateCommunicationAttachmentInput,
): CommunicationAttachment {
  const updatedAt = input.updatedAt ?? new Date().toISOString();

  return {
    ...attachment,
    messageId: input.messageId ?? attachment.messageId,
    status: input.status ?? attachment.status,
    storage: {
      ...attachment.storage,
      publicUrl:
        input.publicUrl ?? attachment.storage.publicUrl,
      checksum:
        input.checksum ?? attachment.storage.checksum,
    },
    media: input.media ?? attachment.media,
    deletedAt: input.deletedAt ?? attachment.deletedAt,
    attributes: input.attributes ?? attachment.attributes,
    metadata: {
      ...attachment.metadata,
      updatedAt,
      updatedBy:
        input.updatedBy ?? attachment.metadata.updatedBy,
    },
  };
}

export function markCommunicationAttachmentReady(
  attachment: CommunicationAttachment,
  publicUrl?: string,
  updatedAt = new Date().toISOString(),
): CommunicationAttachment {
  return updateCommunicationAttachment(attachment, {
    status: "ready",
    publicUrl,
    updatedAt,
  });
}

export function markCommunicationAttachmentFailed(
  attachment: CommunicationAttachment,
  updatedAt = new Date().toISOString(),
): CommunicationAttachment {
  return updateCommunicationAttachment(attachment, {
    status: "failed",
    updatedAt,
  });
}
