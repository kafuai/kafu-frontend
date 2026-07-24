export type CommunicationStorageBucket =
  | "communication-images"
  | "communication-documents"
  | "communication-audio"
  | "communication-video"
  | "communication-files";

export interface CommunicationUploadFile {
  readonly name: string;
  readonly type: string;
  readonly size: number;
  readonly data: Blob;
}

export interface CommunicationStorageUploadInput {
  readonly bucket: CommunicationStorageBucket;
  readonly path: string;
  readonly file: CommunicationUploadFile;
  readonly cacheControl?: string;
  readonly upsert?: boolean;
}

export interface CommunicationStorageUploadResult {
  readonly bucket: CommunicationStorageBucket;
  readonly path: string;
  readonly publicUrl?: string;
}

export interface CommunicationStorageRemoveInput {
  readonly bucket: CommunicationStorageBucket;
  readonly paths: readonly string[];
}

export interface CommunicationStorageSignedUrlInput {
  readonly bucket: CommunicationStorageBucket;
  readonly path: string;
  readonly expiresInSeconds?: number;
}
