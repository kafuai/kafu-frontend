import { EnterpriseExecutionPolicyDecision } from "./policyDecision";

export interface EnterpriseExecutionPolicyAuditRecord {
  id: string;
  targetId: string;
  targetType: string;
  decisionStatus: string;
  reasons: string[];
  evaluatedAt: string;
}

export function createEnterpriseExecutionPolicyAuditRecord(
  id: string,
  targetId: string,
  targetType: string,
  decision: EnterpriseExecutionPolicyDecision
): EnterpriseExecutionPolicyAuditRecord {
  return {
    id,
    targetId,
    targetType,
    decisionStatus: decision.status,
    reasons: decision.reasons,
    evaluatedAt: new Date().toISOString()
  };
}