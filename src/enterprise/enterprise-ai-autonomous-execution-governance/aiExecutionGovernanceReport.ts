import { AIExecutionGovernanceResult } from "./aiExecutionGovernanceTypes";
import { resolveAIExecutionGovernanceStatus } from "./aiExecutionGovernanceStatus";

export interface AIExecutionGovernanceReport {
  executionId: string;
  status: string;
  decision: string;
  authority: string;
  policyCount: number;
  reasons: string[];
  generatedAt: string;
}

export function createAIExecutionGovernanceReport(
  result: AIExecutionGovernanceResult
): AIExecutionGovernanceReport {
  return {
    executionId: result.executionId,
    status: resolveAIExecutionGovernanceStatus(result),
    decision: result.decision,
    authority: result.authority,
    policyCount: result.policyIds.length,
    reasons: result.reasons,
    generatedAt: new Date().toISOString(),
  };
}