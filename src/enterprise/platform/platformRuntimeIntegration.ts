import { PlatformBootstrap } from "./platformBootstrap";
import { PlatformLifecycle } from "./platformLifecycle";
import { PlatformPipeline } from "./platformPipeline";

export class PlatformRuntimeIntegration {
  constructor(
    private readonly bootstrap: PlatformBootstrap,
    private readonly lifecycle: PlatformLifecycle,
    private readonly pipeline: PlatformPipeline,
  ) {}

  async start(): Promise<void> {
    this.bootstrap.boot();
    await this.pipeline.run();
    this.lifecycle.started();
  }

  stop(): void {
    this.bootstrap.shutdown();
    this.lifecycle.stopped();
  }
}