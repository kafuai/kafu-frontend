export type DisasterRecoveryEventType =
  | "plan-created"
  | "plan-activated"
  | "backup-validated"
  | "failover-started"
  | "failover-completed"
  | "failback-started"
  | "failback-completed"
  | "recovery-started"
  | "recovery-completed";

export type DisasterRecoveryEvent = {
  id: string;
  organizationId: string;
  planId: string;
  type: DisasterRecoveryEventType;
  occurredAt: string;
  actor: string;
  summary: string;
  metadata?: Record<string, unknown>;
};

function createEventId(): string {
  return `dr_event_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createDisasterRecoveryEvent(
  event: Omit<DisasterRecoveryEvent, "id" | "occurredAt">,
): DisasterRecoveryEvent {
  return {
    ...event,
    id: createEventId(),
    occurredAt: new Date().toISOString(),
  };
}