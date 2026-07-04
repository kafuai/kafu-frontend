export type ResilienceEventType =
  | "retry.started"
  | "retry.completed"
  | "retry.failed"
  | "failover.executed"
  | "self-healing.started"
  | "self-healing.completed";

export type ResilienceEvent = {
  id: string;
  organizationId: string;
  type: ResilienceEventType;
  occurredAt: Date;
  payload?: Record<string, unknown>;
};

export function createResilienceEvent(
  event: Omit<ResilienceEvent, "occurredAt">,
): ResilienceEvent {
  return {
    ...event,
    occurredAt: new Date(),
  };
}