import { PlatformEventBus } from "./platformEvents";
import { PlatformRuntime } from "./platformRuntime";

export class PlatformLifecycle {
  constructor(
    private readonly runtime: PlatformRuntime,
    private readonly events: PlatformEventBus,
  ) {}

  started(): void {
    this.events.publish({
      type: "platform.started",
      message: "Platform runtime started.",
      metadata: {
        state: this.runtime.getState(),
      },
    });
  }

  stopped(): void {
    this.events.publish({
      type: "platform.stopped",
      message: "Platform runtime stopped.",
      metadata: {
        state: this.runtime.getState(),
      },
    });
  }

  failed(error: Error): void {
    this.events.publish({
      type: "platform.failed",
      message: error.message,
      metadata: {
        state: this.runtime.getState(),
      },
    });
  }
}