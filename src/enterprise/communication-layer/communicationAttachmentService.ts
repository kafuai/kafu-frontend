import type {
  CommunicationAttachment,
  CommunicationAttachmentType,
} from "./communicationModels";

import type {
  CommunicationAttachmentRepository,
} from "./communicationAttachmentRepository";

import type {
  CommunicationStorageService,
  UploadCommunicationFileInput,
} from "./communicationStorageService";

export interface UploadAndRegisterAttachmentInput
  extends UploadCommunicationFileInput {
  messageId?: string;
  attachmentType: CommunicationAttachmentType;
  durationSeconds?: number;
  uploadedBy?: string;
  uploadedByName?: string;
}

export class CommunicationAttachmentService {
  constructor(
    private readonly storageService: CommunicationStorageService,
    private readonly repository: CommunicationAttachmentRepository
  ) {}

  async uploadAndRegister(
    input: UploadAndRegisterAttachmentInput
  ): Promise<CommunicationAttachment> {
    const uploaded =
      await this.storageService.uploadFile(input);

    try {
      return await this.repository.createAttachment({
        companyId: input.companyId,
        conversationId: input.conversationId,
        messageId: input.messageId,
        attachmentType: input.attachmentType,
        storageBucket: uploaded.bucket,
        storagePath: uploaded.path,
        originalFileName: uploaded.fileName,
        mimeType: uploaded.mimeType,
        fileSizeBytes: uploaded.sizeBytes,
        durationSeconds: input.durationSeconds,
        processingStatus:
          input.attachmentType === "audio"
            ? "processing"
            : "ready",
        uploadedBy: input.uploadedBy,
        uploadedByName: input.uploadedByName,
      });
    } catch (error) {
      await this.storageService
        .removeFile(uploaded.path)
        .catch(() => undefined);

      throw error;
    }
  }

  async createDownloadUrl(
    attachment: CommunicationAttachment,
    expiresInSeconds = 300
  ): Promise<string> {
    if (attachment.deleted_at) {
      throw new Error(
        "Deleted attachments cannot be downloaded."
      );
    }

    return this.storageService.createSignedDownloadUrl(
      attachment.storage_path,
      expiresInSeconds
    );
  }

  async deleteAttachment(
    companyId: string,
    attachment: CommunicationAttachment
  ): Promise<void> {
    if (attachment.company_id !== companyId) {
      throw new Error(
        "The attachment does not belong to this company."
      );
    }

    await this.storageService.removeFile(
      attachment.storage_path
    );

    await this.repository.softDeleteAttachment(
      companyId,
      attachment.id
    );
  }
}
