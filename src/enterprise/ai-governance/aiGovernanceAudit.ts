import { AIGovernanceRiskLevel } from "./aiGovernanceTypes";

export type AIGovernanceAuditEventType =
  | "policy_created"
  | "policy_activated"
  | "policy_suspended"
  | "model_registered"
  | "model_approved"
  | "model_retired"
  | "use_case_classified"
  | "decision_recorded"
  | "oversight_reviewed";

export interface AIGovernanceAuditEvent {
  id: string;
  organizationId: string;
  eventType: AIGovernanceAuditEventType;
  actorId: string;
  entityId: string;
  entityType: "policy" | "model" | "use_case" | "decision" | "oversight";
  riskLevel?: AIGovernanceRiskLevel;
  details: Record<string, unknown>;
  occurredAt: Date;
}

export interface CreateAIGovernanceAuditEventInput {
  id: string;
  organizationId: string;
  eventType: AIGovernanceAuditEventType;
  actorId: string;
  entityId: string;
  entityType: AIGovernanceAuditEvent["entityType"];
  riskLevel?: AIGovernanceRiskLevel;
  details?: Record<string, unknown>;
}

export function createAIGovernanceAuditEvent(
  input: CreateAIGovernanceAuditEventInput,
): AIGovernanceAuditEvent {
  return {
    id: input.id,
    organizationId: input.organizationId,
    eventType: input.eventType,
    actorId: input.actorId,
    entityId: input.entityId,
    entityType: input.entityType,
    riskLevel: input.riskLevel,
    details: input.details ?? {},
    occurredAt: new Date(),
  };
}