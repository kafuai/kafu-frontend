type EventHandler<T = unknown> = (payload: T) => void;

const listeners = new Map<string, EventHandler[]>();

export function subscribe<T = unknown>(
  event: string,
  handler: EventHandler<T>
) {
  const handlers = listeners.get(event) ?? [];

  handlers.push(handler as EventHandler);

  listeners.set(event, handlers);
}

export function publish<T = unknown>(event: string, payload: T) {
  const handlers = listeners.get(event);

  if (!handlers) {
    return;
  }

  handlers.forEach((handler) => handler(payload));
}