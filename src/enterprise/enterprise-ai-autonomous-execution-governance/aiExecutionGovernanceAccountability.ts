import {
  AIExecutionGovernanceAuthority,
  AIExecutionGovernanceResult,
} from "./aiExecutionGovernanceTypes";

export interface AIExecutionGovernanceAccountabilityRecord {
  executionId: string;
  accountableAuthority: AIExecutionGovernanceAuthority;
  decision: string;
  policyIds: string[];
  accountabilityNotes: string[];
  recordedAt: string;
}

export function createAIExecutionGovernanceAccountabilityRecord(
  result: AIExecutionGovernanceResult
): AIExecutionGovernanceAccountabilityRecord {
  return {
    executionId: result.executionId,
    accountableAuthority: result.authority,
    decision: result.decision,
    policyIds: result.policyIds,
    accountabilityNotes:
      result.reasons.length > 0
        ? result.reasons
        : ["Governance decision recorded without exception."],
    recordedAt: new Date().toISOString(),
  };
}