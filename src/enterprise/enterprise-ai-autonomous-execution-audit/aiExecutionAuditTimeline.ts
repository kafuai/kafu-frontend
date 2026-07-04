import { AIAutonomousExecutionAuditEvent } from "./aiAutonomousExecutionAuditTypes";

export function createAIAutonomousExecutionAuditTimeline(
  events: AIAutonomousExecutionAuditEvent[],
): AIAutonomousExecutionAuditEvent[] {
  return [...events].sort(
    (a, b) => a.occurredAt.getTime() - b.occurredAt.getTime(),
  );
}

export function getLatestAIAutonomousExecutionAuditEvent(
  events: AIAutonomousExecutionAuditEvent[],
): AIAutonomousExecutionAuditEvent | undefined {
  return createAIAutonomousExecutionAuditTimeline(events).at(-1);
}