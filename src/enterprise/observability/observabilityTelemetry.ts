import {
  ObservabilityContext,
  ObservabilityTelemetryEvent,
} from "./observabilityTypes";

export function createObservabilityTelemetryEvent(
  type: string,
  context: ObservabilityContext,
  payload?: Record<string, unknown>,
): ObservabilityTelemetryEvent {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    type,
    context,
    payload,
  };
}

export function hasObservabilityTelemetryPayload(
  event: ObservabilityTelemetryEvent,
): boolean {
  return Boolean(event.payload && Object.keys(event.payload).length > 0);
}