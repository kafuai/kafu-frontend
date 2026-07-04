export type PlatformStorageObject = {
  key: string;
  content: string;
  contentType?: string;
  metadata?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
};

export class PlatformStorage {
  private readonly objects = new Map<string, PlatformStorageObject>();

  put(
    object: Omit<PlatformStorageObject, "createdAt" | "updatedAt">,
  ): PlatformStorageObject {
    const existing = this.objects.get(object.key);
    const now = new Date();

    const stored: PlatformStorageObject = {
      ...object,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    this.objects.set(object.key, stored);
    return stored;
  }

  get(key: string): PlatformStorageObject | undefined {
    return this.objects.get(key);
  }

  remove(key: string): boolean {
    return this.objects.delete(key);
  }

  list(): PlatformStorageObject[] {
    return [...this.objects.values()];
  }
}