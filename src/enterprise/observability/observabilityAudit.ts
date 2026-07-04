import { ObservabilityEvent } from "./observabilityEvents";

export type ObservabilityAuditRecord = {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  event: ObservabilityEvent;
  metadata?: Record<string, unknown>;
};

export function createObservabilityAuditRecord(
  action: string,
  actor: string,
  event: ObservabilityEvent,
  metadata?: Record<string, unknown>,
): ObservabilityAuditRecord {
  return {
    id: crypto.randomUUID(),
    timestamp: new Date(),
    action,
    actor,
    event,
    metadata,
  };
}