import { PlatformStorageObject } from "./platformStorage";

export type PlatformStorageAdapter = {
  put(object: PlatformStorageObject): Promise<PlatformStorageObject>;
  get(key: string): Promise<PlatformStorageObject | undefined>;
  remove(key: string): Promise<boolean>;
};