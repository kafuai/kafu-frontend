import {
  AIAutonomousExecutionAuditEvent,
  AIAutonomousExecutionAuditOutcome,
  AIAutonomousExecutionAuditSeverity,
} from "./aiAutonomousExecutionAuditTypes";

export interface AIAutonomousExecutionAuditQuery {
  tenantId?: string;
  executionId?: string;
  actorId?: string;
  action?: string;
  severity?: AIAutonomousExecutionAuditSeverity;
  outcome?: AIAutonomousExecutionAuditOutcome;
  from?: Date;
  to?: Date;
  tag?: string;
}

export function queryAIAutonomousExecutionAuditEvents(
  events: AIAutonomousExecutionAuditEvent[],
  query: AIAutonomousExecutionAuditQuery,
): AIAutonomousExecutionAuditEvent[] {
  return events.filter((event) => {
    if (query.tenantId && event.context.tenantId !== query.tenantId) return false;
    if (query.executionId && event.context.executionId !== query.executionId) return false;
    if (query.actorId && event.actor.id !== query.actorId) return false;
    if (query.action && event.action !== query.action) return false;
    if (query.severity && event.severity !== query.severity) return false;
    if (query.outcome && event.outcome !== query.outcome) return false;
    if (query.from && event.occurredAt < query.from) return false;
    if (query.to && event.occurredAt > query.to) return false;
    if (query.tag && !event.metadata.tags?.includes(query.tag)) return false;

    return true;
  });
}