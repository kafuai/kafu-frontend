export type PlatformEventType =
  | "platform.initialized"
  | "platform.started"
  | "platform.stopped"
  | "platform.failed";

export type PlatformEvent = {
  type: PlatformEventType;
  message: string;
  createdAt: Date;
  metadata?: Record<string, unknown>;
};

export class PlatformEventBus {
  private readonly events: PlatformEvent[] = [];

  publish(event: Omit<PlatformEvent, "createdAt">): PlatformEvent {
    const next: PlatformEvent = {
      ...event,
      createdAt: new Date(),
    };

    this.events.push(next);
    return next;
  }

  list(): PlatformEvent[] {
    return [...this.events];
  }
}