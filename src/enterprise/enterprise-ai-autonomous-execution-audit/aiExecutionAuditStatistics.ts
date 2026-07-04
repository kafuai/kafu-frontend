import {
  AIAutonomousExecutionAuditEvent,
  AIAutonomousExecutionAuditOutcome,
  AIAutonomousExecutionAuditSeverity,
} from "./aiAutonomousExecutionAuditTypes";

export interface AIAutonomousExecutionAuditStatistics {
  totalEvents: number;
  severityBreakdown: Record<AIAutonomousExecutionAuditSeverity, number>;
  outcomeBreakdown: Record<AIAutonomousExecutionAuditOutcome, number>;
  uniqueActors: number;
  uniqueActions: number;
}

export function calculateAIAutonomousExecutionAuditStatistics(
  events: AIAutonomousExecutionAuditEvent[],
): AIAutonomousExecutionAuditStatistics {
  const severityBreakdown: Record<AIAutonomousExecutionAuditSeverity, number> = {
    info: 0,
    notice: 0,
    warning: 0,
    critical: 0,
  };

  const outcomeBreakdown: Record<AIAutonomousExecutionAuditOutcome, number> = {
    passed: 0,
    failed: 0,
    flagged: 0,
    requires_review: 0,
  };

  const actors = new Set<string>();
  const actions = new Set<string>();

  for (const event of events) {
    severityBreakdown[event.severity]++;
    outcomeBreakdown[event.outcome]++;
    actors.add(event.actor.id);
    actions.add(event.action);
  }

  return {
    totalEvents: events.length,
    severityBreakdown,
    outcomeBreakdown,
    uniqueActors: actors.size,
    uniqueActions: actions.size,
  };
}