export interface AIOrchestrationAuditEntry {
  readonly executionId: string;
  readonly action: string;
  readonly actor: string;
  readonly timestamp: Date;
  readonly details?: Record<string, unknown>;
}

export function createAIOrchestrationAuditEntry(
  executionId: string,
  action: string,
  actor: string,
  details?: Record<string, unknown>,
): AIOrchestrationAuditEntry {
  return {
    executionId,
    action,
    actor,
    timestamp: new Date(),
    details,
  };
}