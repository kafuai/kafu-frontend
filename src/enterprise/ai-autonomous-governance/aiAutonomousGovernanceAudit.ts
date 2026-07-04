import { AIAutonomousGovernanceDecisionRecord } from "./aiAutonomousGovernanceDecision";
import { AIAutonomousGovernanceEnforcementResult } from "./aiAutonomousGovernanceEnforcement";

export interface AIAutonomousGovernanceAuditEntry {
  id: string;
  organizationId: string;
  executionId: string;
  actorId: string;
  capabilityId: string;
  decision: string;
  allowed: boolean;
  reasons: string[];
  createdAt: Date;
}

export function createAIAutonomousGovernanceAuditEntry(
  organizationId: string,
  actorId: string,
  capabilityId: string,
  decisionRecord: AIAutonomousGovernanceDecisionRecord,
  enforcement: AIAutonomousGovernanceEnforcementResult,
): AIAutonomousGovernanceAuditEntry {
  return {
    id: `${decisionRecord.executionId}:governance-audit`,
    organizationId,
    executionId: decisionRecord.executionId,
    actorId,
    capabilityId,
    decision: decisionRecord.decision,
    allowed: enforcement.allowed,
    reasons: [...decisionRecord.reasons, enforcement.reason],
    createdAt: new Date(),
  };
}