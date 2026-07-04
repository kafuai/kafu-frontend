import { PlatformEventBus } from "./platformEvents";
import { PlatformHealth } from "./platformHealth";
import { PlatformMetrics } from "./platformMetrics";
import { PlatformRuntime } from "./platformRuntime";
import { PlatformServices } from "./platformServices";

export function createPlatformRuntime() {
  const services = new PlatformServices();
  services.initialize();

  const health = new PlatformHealth(services.registry);
  const runtime = new PlatformRuntime(services, health);
  const events = new PlatformEventBus();
  const metrics = new PlatformMetrics();

  return {
    services,
    health,
    runtime,
    events,
    metrics,
  };
}