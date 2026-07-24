import { supabase } from "../../../../lib/supabase";

import type {
  CommunicationStorageService,
} from "./communicationStorageService";
import type {
  CommunicationStorageRemoveInput,
  CommunicationStorageSignedUrlInput,
  CommunicationStorageUploadInput,
  CommunicationStorageUploadResult,
} from "./communicationStorageTypes";

export class SupabaseCommunicationStorage
  implements CommunicationStorageService
{
  async upload(
    input: CommunicationStorageUploadInput,
  ): Promise<CommunicationStorageUploadResult> {
    const { data, error } = await supabase.storage
      .from(input.bucket)
      .upload(input.path, input.file.data, {
        cacheControl: input.cacheControl ?? "3600",
        contentType: input.file.type,
        upsert: input.upsert ?? false,
      });

    if (error) {
      throw new Error(
        `Communication file upload failed: ${error.message}`,
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(input.bucket)
      .getPublicUrl(data.path);

    return {
      bucket: input.bucket,
      path: data.path,
      publicUrl: publicUrlData.publicUrl || undefined,
    };
  }

  async remove(
    input: CommunicationStorageRemoveInput,
  ): Promise<void> {
    if (input.paths.length === 0) {
      return;
    }

    const { error } = await supabase.storage
      .from(input.bucket)
      .remove([...input.paths]);

    if (error) {
      throw new Error(
        `Communication file removal failed: ${error.message}`,
      );
    }
  }

  async createSignedUrl(
    input: CommunicationStorageSignedUrlInput,
  ): Promise<string> {
    const { data, error } = await supabase.storage
      .from(input.bucket)
      .createSignedUrl(
        input.path,
        input.expiresInSeconds ?? 3600,
      );

    if (error || !data?.signedUrl) {
      throw new Error(
        `Communication signed URL creation failed: ${
          error?.message ?? "Signed URL was not returned."
        }`,
      );
    }

    return data.signedUrl;
  }
}

export const communicationStorage =
  new SupabaseCommunicationStorage();
