import "server-only";
import { randomUUID } from "node:crypto";

import { createSupabaseAdminClient } from "@/lib/supabase-auth/admin";
import { LeaveValidationError } from "./leaveValidator";
import type { LeaveAttachment } from "../types/leaveTypes";

export const LEAVE_ATTACHMENT_BUCKET = "employee-leave-attachments";
export const LEAVE_ATTACHMENT_MAX_BYTES = 4 * 1024 * 1024;
const SIGNED_URL_TTL_SECONDS = 60;

const ALLOWED_MIME = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
} as const;
type AllowedMime = keyof typeof ALLOWED_MIME;

const MSG = {
  required: {
    en: "Sick leave certificate is required.",
    ar: "شهادة الإجازة المرضية مطلوبة.",
  },
  type: {
    en: "The selected file type is not supported. Use PDF, JPG or PNG.",
    ar: "نوع الملف المحدد غير مدعوم. استخدم PDF أو JPG أو PNG.",
  },
  size: {
    en: "The selected file is too large (max 4 MB).",
    ar: "حجم الملف المحدد كبير جدًا (الحد الأقصى 4 ميجابايت).",
  },
} as const;

// Never trust the client-declared MIME: verify the real file signature.
function sniffMime(b: Buffer): AllowedMime | null {
  if (b.length >= 5 && b.subarray(0, 5).toString("latin1") === "%PDF-") {
    return "application/pdf";
  }
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    b.length >= 8 &&
    b.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  ) {
    return "image/png";
  }
  return null;
}

export interface ValidatedLeaveAttachment {
  buffer: Buffer;
  mimeType: AllowedMime;
  extension: string;
  displayName: string; // metadata only, never used in the storage path
  sizeBytes: number;
}

export async function validateLeaveAttachment(
  file: unknown,
  lang: "ar" | "en",
): Promise<ValidatedLeaveAttachment> {
  if (!(file instanceof File) || file.size === 0) {
    throw new LeaveValidationError([MSG.required[lang]]);
  }
  if (file.size > LEAVE_ATTACHMENT_MAX_BYTES) {
    throw new LeaveValidationError([MSG.size[lang]]);
  }
  if (!(file.type in ALLOWED_MIME)) {
    throw new LeaveValidationError([MSG.type[lang]]);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = sniffMime(buffer);
  if (!detected || detected !== file.type) {
    throw new LeaveValidationError([MSG.type[lang]]);
  }

  const extension = ALLOWED_MIME[detected];
  const displayName =
    file.name.replace(/[\\/\u0000-\u001f]/g, "").trim().slice(-100) ||
    `certificate.${extension}`;

  return { buffer, mimeType: detected, extension, displayName, sizeBytes: buffer.length };
}

export async function uploadLeaveAttachment(params: {
  companyId: string;
  employeeId: string;
  requestId: string;
  file: ValidatedLeaveAttachment;
}): Promise<LeaveAttachment> {
  // Generated path: no user-controlled segment => no traversal/collision.
  const path = [
    params.companyId,
    params.employeeId,
    params.requestId,
    `${randomUUID()}.${params.file.extension}`,
  ].join("/");

  const { error } = await createSupabaseAdminClient()
    .storage.from(LEAVE_ATTACHMENT_BUCKET)
    .upload(path, params.file.buffer, {
      contentType: params.file.mimeType,
      upsert: false,
    });

  if (error) throw new Error(`Unable to upload attachment: ${error.message}`);

  return {
    bucket: LEAVE_ATTACHMENT_BUCKET,
    path,
    fileName: params.file.displayName,
    mimeType: params.file.mimeType,
    sizeBytes: params.file.sizeBytes,
  };
}

export async function removeLeaveAttachment(path: string): Promise<void> {
  const { error } = await createSupabaseAdminClient()
    .storage.from(LEAVE_ATTACHMENT_BUCKET)
    .remove([path]);
  if (error) console.error("Orphan attachment cleanup failed:", path, error);
}

export async function createLeaveAttachmentSignedUrl(
  path: string,
  downloadName: string,
): Promise<string> {
  const { data, error } = await createSupabaseAdminClient()
    .storage.from(LEAVE_ATTACHMENT_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS, {
      download: downloadName, // forces "attachment" + sets the file name
    });
  if (error || !data?.signedUrl) {
    throw new Error("Unable to create attachment link.");
  }
  return data.signedUrl;
}