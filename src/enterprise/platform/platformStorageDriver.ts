import { PlatformStorageObject } from "./platformStorage";

export type PlatformStorageDriver = {
  name: string;
  write(object: PlatformStorageObject): Promise<PlatformStorageObject>;
  read(key: string): Promise<PlatformStorageObject | undefined>;
  delete(key: string): Promise<boolean>;
};