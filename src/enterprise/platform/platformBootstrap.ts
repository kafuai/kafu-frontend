import { PlatformRuntime } from "./platformRuntime";

export class PlatformBootstrap {
  constructor(
    private readonly runtime: PlatformRuntime,
  ) {}

  boot(): PlatformRuntime {
    this.runtime.initialize();
    this.runtime.start();

    return this.runtime;
  }

  shutdown(): void {
    this.runtime.stop();
  }
}