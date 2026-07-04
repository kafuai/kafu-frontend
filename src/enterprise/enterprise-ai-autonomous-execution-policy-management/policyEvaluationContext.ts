export interface EnterpriseExecutionPolicyEvaluationTarget {
  targetId: string;
  targetType: "operation" | "workflow" | "process" | "task" | "action";
  tenantId: string;
  environment: "development" | "staging" | "production";
}

export interface EnterpriseExecutionPolicyEvaluationRuntime {
  riskScore: number;
  retryAttempts: number;
  elapsedMs: number;
  requestedResources: number;
  requiresHumanApproval?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

export interface EnterpriseExecutionPolicyEvaluationContext {
  target: EnterpriseExecutionPolicyEvaluationTarget;
  runtime: EnterpriseExecutionPolicyEvaluationRuntime;
}

export function createEnterpriseExecutionPolicyEvaluationContext(
  target: EnterpriseExecutionPolicyEvaluationTarget,
  runtime: EnterpriseExecutionPolicyEvaluationRuntime
): EnterpriseExecutionPolicyEvaluationContext {
  return {
    target,
    runtime,
  };
}