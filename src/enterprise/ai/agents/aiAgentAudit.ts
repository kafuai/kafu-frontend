export type AIAgentAuditAction =
  | "agent.created"
  | "agent.updated"
  | "agent.validated"
  | "agent.execution.started"
  | "agent.execution.completed"
  | "agent.execution.failed"
  | "agent.policy.evaluated"
  | "agent.decision.created"
  | "agent.feedback.received";

export interface AIAgentAuditEntry {
  id: string;
  organizationId: string;
  agentId: string;
  action: AIAgentAuditAction;
  actorId: string;
  details: Record<string, unknown>;
  occurredAt: Date;
}

export function createAIAgentAuditEntry(
  id: string,
  organizationId: string,
  agentId: string,
  action: AIAgentAuditAction,
  actorId: string,
  details: Record<string, unknown> = {},
): AIAgentAuditEntry {
  return {
    id,
    organizationId,
    agentId,
    action,
    actorId,
    details,
    occurredAt: new Date(),
  };
}