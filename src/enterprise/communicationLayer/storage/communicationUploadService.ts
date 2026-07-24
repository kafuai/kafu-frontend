import {
  createCommunicationAttachment,
} from "../communicationAttachment";
import type {
  CommunicationAttachment,
  CommunicationAttachmentType,
} from "../communicationAttachment";
import type {
  CommunicationRepository,
} from "../communicationRepository";
import type {
  CommunicationStorageService,
} from "./communicationStorageService";
import type {
  CommunicationStorageBucket,
  CommunicationUploadFile,
} from "./communicationStorageTypes";

export interface UploadCommunicationAttachmentInput {
  readonly attachmentId: string;
  readonly companyId: string;
  readonly conversationId: string;
  readonly messageId: string;
  readonly createdBy: string;
  readonly file: CommunicationUploadFile;
  readonly durationSeconds?: number;
}

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

function sanitizeFileName(fileName: string): string {
  return fileName
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

function resolveAttachmentType(
  mimeType: string,
): CommunicationAttachmentType {
  if (mimeType.startsWith("image/")) {
    return "image";
  }

  if (mimeType.startsWith("audio/")) {
    return "audio";
  }

  if (mimeType.startsWith("video/")) {
    return "video";
  }

  if (
    mimeType.includes("pdf") ||
    mimeType.includes("document") ||
    mimeType.includes("sheet") ||
    mimeType.includes("presentation") ||
    mimeType.startsWith("text/")
  ) {
    return "document";
  }

  if (
    mimeType.includes("zip") ||
    mimeType.includes("compressed") ||
    mimeType.includes("archive")
  ) {
    return "archive";
  }

  return "other";
}

function resolveBucket(
  type: CommunicationAttachmentType,
): CommunicationStorageBucket {
  switch (type) {
    case "image":
      return "communication-images";
    case "audio":
      return "communication-audio";
    case "video":
      return "communication-video";
    case "document":
      return "communication-documents";
    default:
      return "communication-files";
  }
}

export class CommunicationUploadService {
  constructor(
    private readonly storage: CommunicationStorageService,
    private readonly repository: CommunicationRepository,
  ) {}

  async uploadAttachment(
    input: UploadCommunicationAttachmentInput,
  ): Promise<CommunicationAttachment> {
    this.validateFile(input.file);

    const attachmentType = resolveAttachmentType(
      input.file.type,
    );

    const bucket = resolveBucket(attachmentType);

    const fileName = sanitizeFileName(input.file.name);

    const storagePath = [
      input.companyId,
      input.conversationId,
      input.messageId,
      `${input.attachmentId}-${fileName}`,
    ].join("/");

    const uploadResult = await this.storage.upload({
      bucket,
      path: storagePath,
      file: input.file,
    });

    const attachment = createCommunicationAttachment({
      id: input.attachmentId,
      companyId: input.companyId,
      conversationId: input.conversationId,
      messageId: input.messageId,
      type: attachmentType,
      fileName: input.file.name,
      mimeType: input.file.type,
      sizeBytes: input.file.size,
      storagePath: `${bucket}/${uploadResult.path}`,
      publicUrl: uploadResult.publicUrl,
      durationSeconds: input.durationSeconds,
      createdAt: new Date().toISOString(),
      createdBy: input.createdBy,
    });

    try {
      return await this.repository.createAttachment(
        attachment,
      );
    } catch (error) {
      await this.storage.remove({
        bucket,
        paths: [uploadResult.path],
      });

      throw error;
    }
  }

  private validateFile(
    file: CommunicationUploadFile,
  ): void {
    if (!file.name.trim()) {
      throw new Error(
        "Communication attachment requires a file name.",
      );
    }

    if (!file.type.trim()) {
      throw new Error(
        "Communication attachment requires a MIME type.",
      );
    }

    if (file.size <= 0) {
      throw new Error(
        "Communication attachment cannot be empty.",
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      throw new Error(
        "Communication attachment exceeds the 25 MB limit.",
      );
    }
  }
}


