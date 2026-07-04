import { PlatformCacheManager } from "./platformCacheManager";
import { PlatformMetrics } from "./platformMetrics";

export class PlatformMaintenance {
  constructor(
    private readonly cache: PlatformCacheManager,
    private readonly metrics: PlatformMetrics,
  ) {}

  run(): void {
    this.cache.flush();
    this.metrics.record("platform.maintenance.completed", 1);
  }
}