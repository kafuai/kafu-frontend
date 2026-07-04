export type AutomationAuditRecord = {
  id: string;
  automationId: string;
  organizationId: string;
  action: string;
  performedAt: Date;
  actor?: string;
  details?: Record<string, unknown>;
};

export function createAutomationAuditRecord(input: {
  automationId: string;
  organizationId: string;
  action: string;
  actor?: string;
  details?: Record<string, unknown>;
}): AutomationAuditRecord {
  return {
    id: `${input.automationId}:${Date.now()}`,
    automationId: input.automationId,
    organizationId: input.organizationId,
    action: input.action,
    performedAt: new Date(),
    actor: input.actor,
    details: input.details,
  };
}