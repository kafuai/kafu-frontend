import { PlatformHealth } from "./platformHealth";
import { PlatformServices } from "./platformServices";

export type PlatformRuntimeState =
  | "created"
  | "initialized"
  | "running"
  | "stopped"
  | "failed";

export class PlatformRuntime {
  private state: PlatformRuntimeState = "created";

  constructor(
    private readonly services: PlatformServices,
    private readonly health: PlatformHealth,
  ) {}

  initialize(): void {
    this.services.initialize();
    this.state = "initialized";
  }

  start(): void {
    if (!this.health.healthy()) {
      this.state = "failed";
      throw new Error("Platform runtime health check failed.");
    }

    this.state = "running";
  }

  stop(): void {
    this.state = "stopped";
  }

  getState(): PlatformRuntimeState {
    return this.state;
  }
}