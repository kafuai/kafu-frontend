export type AIAutonomousExecutionAuditSeverity =
  | "info"
  | "notice"
  | "warning"
  | "critical";

export type AIAutonomousExecutionAuditOutcome =
  | "passed"
  | "failed"
  | "flagged"
  | "requires_review";

export type AIAutonomousExecutionAuditActorType =
  | "system"
  | "ai_agent"
  | "human"
  | "integration";

export interface AIAutonomousExecutionAuditActor {
  id: string;
  type: AIAutonomousExecutionAuditActorType;
  name?: string;
}

export interface AIAutonomousExecutionAuditContext {
  tenantId: string;
  executionId: string;
  workflowId?: string;
  policyId?: string;
  governanceId?: string;
  correlationId?: string;
}

export interface AIAutonomousExecutionAuditMetadata {
  source: string;
  milestone: string;
  tags?: string[];
  details?: Record<string, unknown>;
}

export interface AIAutonomousExecutionAuditEventInput {
  action: string;
  actor: AIAutonomousExecutionAuditActor;
  context: AIAutonomousExecutionAuditContext;
  severity: AIAutonomousExecutionAuditSeverity;
  outcome: AIAutonomousExecutionAuditOutcome;
  metadata: AIAutonomousExecutionAuditMetadata;
  occurredAt?: Date;
}

export interface AIAutonomousExecutionAuditEvent {
  id: string;
  action: string;
  actor: AIAutonomousExecutionAuditActor;
  context: AIAutonomousExecutionAuditContext;
  severity: AIAutonomousExecutionAuditSeverity;
  outcome: AIAutonomousExecutionAuditOutcome;
  metadata: AIAutonomousExecutionAuditMetadata;
  occurredAt: Date;
  immutableHash: string;
}