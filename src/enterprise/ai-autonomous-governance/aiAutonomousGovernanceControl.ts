import { AIAutonomousGovernanceDecisionRecord } from "./aiAutonomousGovernanceDecision";
import { AIAutonomousGovernanceControlType } from "./aiAutonomousGovernanceTypes";

export interface AIAutonomousGovernanceControlStatus {
  executionId: string;
  control: AIAutonomousGovernanceControlType;
  satisfied: boolean;
  reason: string;
  checkedAt: Date;
}

export function createAIAutonomousGovernanceControlStatuses(
  decision: AIAutonomousGovernanceDecisionRecord,
  satisfiedControls: AIAutonomousGovernanceControlType[],
): AIAutonomousGovernanceControlStatus[] {
  return decision.requiredControls.map((control) => ({
    executionId: decision.executionId,
    control,
    satisfied: satisfiedControls.includes(control),
    reason: satisfiedControls.includes(control)
      ? `Control satisfied: ${control}.`
      : `Control required but not satisfied: ${control}.`,
    checkedAt: new Date(),
  }));
}

export function areAIAutonomousGovernanceControlsSatisfied(
  statuses: AIAutonomousGovernanceControlStatus[],
): boolean {
  return statuses.every((status) => status.satisfied);
}