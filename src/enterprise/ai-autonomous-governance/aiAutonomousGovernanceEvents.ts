import { AIAutonomousGovernanceAuditEntry } from "./aiAutonomousGovernanceAudit";
import { AIAutonomousGovernanceDecisionRecord } from "./aiAutonomousGovernanceDecision";
import { AIAutonomousGovernanceEnforcementResult } from "./aiAutonomousGovernanceEnforcement";

export type AIAutonomousGovernanceEventType =
  | "ai.autonomous.governance.decision.created"
  | "ai.autonomous.governance.enforcement.completed"
  | "ai.autonomous.governance.audit.created";

export interface AIAutonomousGovernanceEvent {
  id: string;
  type: AIAutonomousGovernanceEventType;
  executionId: string;
  occurredAt: Date;
  payload:
    | AIAutonomousGovernanceDecisionRecord
    | AIAutonomousGovernanceEnforcementResult
    | AIAutonomousGovernanceAuditEntry;
}

export function createAIAutonomousGovernanceEvents(
  decision: AIAutonomousGovernanceDecisionRecord,
  enforcement: AIAutonomousGovernanceEnforcementResult,
  audit: AIAutonomousGovernanceAuditEntry,
): AIAutonomousGovernanceEvent[] {
  return [
    {
      id: `${decision.executionId}:governance-decision`,
      type: "ai.autonomous.governance.decision.created",
      executionId: decision.executionId,
      occurredAt: decision.decidedAt,
      payload: decision,
    },
    {
      id: `${decision.executionId}:governance-enforcement`,
      type: "ai.autonomous.governance.enforcement.completed",
      executionId: decision.executionId,
      occurredAt: enforcement.enforcedAt,
      payload: enforcement,
    },
    {
      id: `${decision.executionId}:governance-audit`,
      type: "ai.autonomous.governance.audit.created",
      executionId: decision.executionId,
      occurredAt: audit.createdAt,
      payload: audit,
    },
  ];
}