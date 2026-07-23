import { supabase } from "../../../lib/supabase";

export const COMMUNICATION_STORAGE_BUCKET =
  "communication-attachments";

export const MAX_COMMUNICATION_FILE_SIZE_BYTES =
  25 * 1024 * 1024;

export interface UploadCommunicationFileInput {
  companyId: string;
  conversationId: string;
  file: File | Blob;
  fileName: string;
}

export interface UploadedCommunicationFile {
  bucket: string;
  path: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

function sanitizeFileName(fileName: string): string {
  const trimmed = fileName.trim();

  const sanitized = trimmed
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return sanitized || "attachment";
}

function validateIdentifier(
  value: string,
  fieldName: string
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} is required.`);
  }

  if (normalized.includes("/") || normalized.includes("\\")) {
    throw new Error(`${fieldName} contains invalid characters.`);
  }

  return normalized;
}

export class CommunicationStorageService {
  async uploadFile(
    input: UploadCommunicationFileInput
  ): Promise<UploadedCommunicationFile> {
    const companyId = validateIdentifier(
      input.companyId,
      "Company ID"
    );

    const conversationId = validateIdentifier(
      input.conversationId,
      "Conversation ID"
    );

    const fileSize = input.file.size;

    if (fileSize <= 0) {
      throw new Error("The selected file is empty.");
    }

    if (fileSize > MAX_COMMUNICATION_FILE_SIZE_BYTES) {
      throw new Error(
        "The selected file exceeds the 25 MB limit."
      );
    }

    const safeName = sanitizeFileName(input.fileName);
    const uniqueName = `${crypto.randomUUID()}-${safeName}`;

    const storagePath =
      `${companyId}/${conversationId}/${uniqueName}`;

    const { error } = await supabase.storage
      .from(COMMUNICATION_STORAGE_BUCKET)
      .upload(storagePath, input.file, {
        cacheControl: "3600",
        contentType:
          input.file.type || "application/octet-stream",
        upsert: false,
      });

    if (error) {
      throw new Error(
        `Unable to upload communication file: ${error.message}`
      );
    }

    return {
      bucket: COMMUNICATION_STORAGE_BUCKET,
      path: storagePath,
      fileName: input.fileName,
      mimeType:
        input.file.type || "application/octet-stream",
      sizeBytes: fileSize,
    };
  }

  async createSignedDownloadUrl(
    storagePath: string,
    expiresInSeconds = 300
  ): Promise<string> {
    if (!storagePath.trim()) {
      throw new Error("Storage path is required.");
    }

    const { data, error } = await supabase.storage
      .from(COMMUNICATION_STORAGE_BUCKET)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      throw new Error(
        `Unable to create attachment URL: ${
          error?.message ?? "No signed URL returned."
        }`
      );
    }

    return data.signedUrl;
  }

  async removeFile(storagePath: string): Promise<void> {
    if (!storagePath.trim()) {
      throw new Error("Storage path is required.");
    }

    const { error } = await supabase.storage
      .from(COMMUNICATION_STORAGE_BUCKET)
      .remove([storagePath]);

    if (error) {
      throw new Error(
        `Unable to remove communication file: ${error.message}`
      );
    }
  }
}

export const communicationStorageService =
  new CommunicationStorageService();
