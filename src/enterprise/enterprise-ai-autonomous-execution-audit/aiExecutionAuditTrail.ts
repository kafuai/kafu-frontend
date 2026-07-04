import { AIAutonomousExecutionAuditEvent } from "./aiAutonomousExecutionAuditTypes";

export interface AIAutonomousExecutionAuditTrail {
  tenantId: string;
  executionId: string;
  events: AIAutonomousExecutionAuditEvent[];
  firstEventAt?: Date;
  lastEventAt?: Date;
  totalEvents: number;
  criticalEvents: number;
  failedEvents: number;
  requiresReviewEvents: number;
}

export function createAIAutonomousExecutionAuditTrail(
  tenantId: string,
  executionId: string,
  events: AIAutonomousExecutionAuditEvent[],
): AIAutonomousExecutionAuditTrail {
  const orderedEvents = [...events].sort(
    (first, second) => first.occurredAt.getTime() - second.occurredAt.getTime(),
  );

  return {
    tenantId,
    executionId,
    events: orderedEvents,
    firstEventAt: orderedEvents[0]?.occurredAt,
    lastEventAt: orderedEvents[orderedEvents.length - 1]?.occurredAt,
    totalEvents: orderedEvents.length,
    criticalEvents: orderedEvents.filter((event) => event.severity === "critical")
      .length,
    failedEvents: orderedEvents.filter((event) => event.outcome === "failed")
      .length,
    requiresReviewEvents: orderedEvents.filter(
      (event) => event.outcome === "requires_review",
    ).length,
  };
}

export function appendAIAutonomousExecutionAuditEvent(
  trail: AIAutonomousExecutionAuditTrail,
  event: AIAutonomousExecutionAuditEvent,
): AIAutonomousExecutionAuditTrail {
  return createAIAutonomousExecutionAuditTrail(trail.tenantId, trail.executionId, [
    ...trail.events,
    event,
  ]);
}