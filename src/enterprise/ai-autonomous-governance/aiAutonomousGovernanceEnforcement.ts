import { AIAutonomousGovernanceDecisionRecord } from "./aiAutonomousGovernanceDecision";
import {
  areAIAutonomousGovernanceControlsSatisfied,
  AIAutonomousGovernanceControlStatus,
} from "./aiAutonomousGovernanceControl";

export interface AIAutonomousGovernanceEnforcementResult {
  executionId: string;
  allowed: boolean;
  reason: string;
  decision: AIAutonomousGovernanceDecisionRecord;
  controlStatuses: AIAutonomousGovernanceControlStatus[];
  enforcedAt: Date;
}

export function enforceAIAutonomousGovernanceDecision(
  decision: AIAutonomousGovernanceDecisionRecord,
  controlStatuses: AIAutonomousGovernanceControlStatus[],
): AIAutonomousGovernanceEnforcementResult {
  if (decision.decision === "blocked") {
    return {
      executionId: decision.executionId,
      allowed: false,
      reason: "Execution blocked by autonomous governance policy.",
      decision,
      controlStatuses,
      enforcedAt: new Date(),
    };
  }

  if (decision.decision === "requires_human_review") {
    return {
      executionId: decision.executionId,
      allowed: false,
      reason: "Execution requires human review before proceeding.",
      decision,
      controlStatuses,
      enforcedAt: new Date(),
    };
  }

  if (
    decision.decision === "approved_with_controls" &&
    !areAIAutonomousGovernanceControlsSatisfied(controlStatuses)
  ) {
    return {
      executionId: decision.executionId,
      allowed: false,
      reason: "Execution controls are required but not fully satisfied.",
      decision,
      controlStatuses,
      enforcedAt: new Date(),
    };
  }

  return {
    executionId: decision.executionId,
    allowed: true,
    reason: "Execution approved by autonomous governance.",
    decision,
    controlStatuses,
    enforcedAt: new Date(),
  };
}