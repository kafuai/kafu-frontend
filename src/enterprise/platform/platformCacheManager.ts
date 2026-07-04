import { PlatformCache } from "./platformCache";

export class PlatformCacheManager {
  constructor(private readonly cache: PlatformCache) {}

  remember<T>(key: string, factory: () => T, ttlMs?: number): T {
    const cached = this.cache.get<T>(key);

    if (cached !== undefined) {
      return cached;
    }

    const value = factory();
    this.cache.set(key, value, ttlMs);

    return value;
  }

  invalidate(key: string): void {
    this.cache.remove(key);
  }

  flush(): void {
    this.cache.clear();
  }
}