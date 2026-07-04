export type PlatformCacheEntry<T = unknown> = {
  key: string;
  value: T;
  expiresAt?: Date;
};

export class PlatformCache {
  private readonly entries = new Map<string, PlatformCacheEntry>();

  set<T>(key: string, value: T, ttlMs?: number): void {
    this.entries.set(key, {
      key,
      value,
      expiresAt: ttlMs ? new Date(Date.now() + ttlMs) : undefined,
    });
  }

  get<T>(key: string): T | undefined {
    const entry = this.entries.get(key);

    if (!entry) return undefined;

    if (entry.expiresAt && entry.expiresAt.getTime() < Date.now()) {
      this.entries.delete(key);
      return undefined;
    }

    return entry.value as T;
  }

  remove(key: string): boolean {
    return this.entries.delete(key);
  }

  clear(): void {
    this.entries.clear();
  }
}