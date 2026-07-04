import { AIAutonomousExecutionAuditEvent } from "./aiAutonomousExecutionAuditTypes";

export interface AIAutonomousExecutionAuditIntegrityIssue {
  eventId: string;
  reason: string;
}

export interface AIAutonomousExecutionAuditIntegrityReport {
  valid: boolean;
  checkedEvents: number;
  issues: AIAutonomousExecutionAuditIntegrityIssue[];
}

export function verifyAIAutonomousExecutionAuditIntegrity(
  events: AIAutonomousExecutionAuditEvent[],
): AIAutonomousExecutionAuditIntegrityReport {
  const seenHashes = new Set<string>();
  const seenIds = new Set<string>();
  const issues: AIAutonomousExecutionAuditIntegrityIssue[] = [];

  for (const event of events) {
    if (!event.id.trim()) {
      issues.push({
        eventId: event.id,
        reason: "Audit event id is missing.",
      });
    }

    if (!event.immutableHash.trim()) {
      issues.push({
        eventId: event.id,
        reason: "Audit event immutable hash is missing.",
      });
    }

    if (seenIds.has(event.id)) {
      issues.push({
        eventId: event.id,
        reason: "Duplicate audit event id detected.",
      });
    }

    if (seenHashes.has(event.immutableHash)) {
      issues.push({
        eventId: event.id,
        reason: "Duplicate immutable hash detected.",
      });
    }

    seenIds.add(event.id);
    seenHashes.add(event.immutableHash);
  }

  return {
    valid: issues.length === 0,
    checkedEvents: events.length,
    issues,
  };
}