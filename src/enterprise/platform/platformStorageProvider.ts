import {
  PlatformStorage,
  PlatformStorageObject,
} from "./platformStorage";

export class PlatformStorageProvider {
  constructor(
    private readonly storage: PlatformStorage,
  ) {}

  save(
    object: Omit<PlatformStorageObject, "createdAt" | "updatedAt">,
  ): PlatformStorageObject {
    return this.storage.put(object);
  }

  load(key: string): PlatformStorageObject | undefined {
    return this.storage.get(key);
  }

  delete(key: string): boolean {
    return this.storage.remove(key);
  }

  list(): PlatformStorageObject[] {
    return this.storage.list();
  }
}