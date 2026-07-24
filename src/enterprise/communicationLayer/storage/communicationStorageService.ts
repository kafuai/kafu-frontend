import type {
  CommunicationStorageRemoveInput,
  CommunicationStorageSignedUrlInput,
  CommunicationStorageUploadInput,
  CommunicationStorageUploadResult,
} from "./communicationStorageTypes";

export interface CommunicationStorageService {
  upload(
    input: CommunicationStorageUploadInput,
  ): Promise<CommunicationStorageUploadResult>;

  remove(
    input: CommunicationStorageRemoveInput,
  ): Promise<void>;

  createSignedUrl(
    input: CommunicationStorageSignedUrlInput,
  ): Promise<string>;
}
