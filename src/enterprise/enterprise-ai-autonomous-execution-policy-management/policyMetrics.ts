import { EnterpriseExecutionPolicyDecision } from "./policyDecision";

export interface EnterpriseExecutionPolicyMetrics {
  totalEvaluations: number;
  allowed: number;
  denied: number;
  approvalRequired: number;
  escalationRequired: number;
}

export function createEnterpriseExecutionPolicyMetrics(): EnterpriseExecutionPolicyMetrics {
  return {
    totalEvaluations: 0,
    allowed: 0,
    denied: 0,
    approvalRequired: 0,
    escalationRequired: 0
  };
}

export function recordEnterpriseExecutionPolicyDecision(
  metrics: EnterpriseExecutionPolicyMetrics,
  decision: EnterpriseExecutionPolicyDecision
): void {
  metrics.totalEvaluations++;

  switch (decision.status) {
    case "allowed":
      metrics.allowed++;
      break;

    case "denied":
      metrics.denied++;
      break;

    case "requires_approval":
      metrics.approvalRequired++;
      break;

    case "requires_escalation":
      metrics.escalationRequired++;
      break;
  }
}