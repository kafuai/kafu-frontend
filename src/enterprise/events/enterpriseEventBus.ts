import {
  EnterpriseEvent,
  EnterpriseEventHandler,
  EnterpriseEventName,
  EnterpriseEventPayload,
} from "./enterpriseEventTypes";

export class EnterpriseEventBus {
  private readonly handlers = new Map<
    EnterpriseEventName,
    EnterpriseEventHandler[]
  >();

  on<TPayload extends EnterpriseEventPayload>(
    name: EnterpriseEventName,
    handler: EnterpriseEventHandler<TPayload>,
  ): void {
    const handlers = this.handlers.get(name) ?? [];

    handlers.push(handler as EnterpriseEventHandler);
    this.handlers.set(name, handlers);
  }

  emit<TPayload extends EnterpriseEventPayload>(
    name: EnterpriseEventName,
    payload: TPayload,
  ): EnterpriseEvent<TPayload> {
    const event: EnterpriseEvent<TPayload> = {
      name,
      payload,
      emittedAt: new Date().toISOString(),
    };

    const handlers = this.handlers.get(name) ?? [];

    for (const handler of handlers) {
      handler(event);
    }

    return event;
  }

  getRegisteredEvents(): EnterpriseEventName[] {
    return Array.from(this.handlers.keys());
  }
}