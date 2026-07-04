import { ObservabilitySignalType } from "./observabilityTypes";

export type ObservabilityEvent = {
  id: string;
  signal: ObservabilitySignalType;
  timestamp: Date;
  source: string;
  payload: Record<string, unknown>;
};

export function createObservabilityEvent(
  signal: ObservabilitySignalType,
  source: string,
  payload: Record<string, unknown> = {},
): ObservabilityEvent {
  return {
    id: crypto.randomUUID(),
    signal,
    timestamp: new Date(),
    source,
    payload,
  };
}

export function isObservabilityEventOfType(
  event: ObservabilityEvent,
  signal: ObservabilitySignalType,
): boolean {
  return event.signal === signal;
}