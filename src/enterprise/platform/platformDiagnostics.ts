import { PlatformHealth } from "./platformHealth";
import { PlatformMetrics } from "./platformMetrics";

export class PlatformDiagnostics {
  constructor(
    private readonly health: PlatformHealth,
    private readonly metrics: PlatformMetrics,
  ) {}

  snapshot() {
    return {
      healthy: this.health.healthy(),
      services: this.health.check(),
      metrics: this.metrics.list(),
      capturedAt: new Date(),
    };
  }
}