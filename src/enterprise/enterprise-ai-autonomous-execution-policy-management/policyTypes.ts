export type EnterpriseExecutionPolicyType =
  | "execution"
  | "runtime"
  | "retry"
  | "timeout"
  | "approval"
  | "escalation"
  | "resource"
  | "scheduling"
  | "compliance"
  | "security";

export type EnterpriseExecutionPolicySeverity =
  | "info"
  | "warning"
  | "critical"
  | "blocking";

export type EnterpriseExecutionPolicyStatus =
  | "draft"
  | "active"
  | "deprecated"
  | "retired";

export interface EnterpriseExecutionPolicyScope {
  tenantId: string;
  environment: "development" | "staging" | "production";
  appliesTo: Array<"operation" | "workflow" | "process" | "task" | "action">;
}

export interface EnterpriseExecutionPolicyCondition {
  key: string;
  operator:
    | "equals"
    | "not_equals"
    | "contains"
    | "greater_than"
    | "less_than"
    | "exists";
  value?: string | number | boolean;
}

export interface EnterpriseExecutionPolicyEffect {
  allowExecution: boolean;
  requiresApproval: boolean;
  requiresEscalation: boolean;
  maxRetryAttempts?: number;
  timeoutMs?: number;
  resourceLimit?: number;
  reason: string;
}

export interface EnterpriseExecutionPolicy {
  id: string;
  name: string;
  description: string;
  type: EnterpriseExecutionPolicyType;
  status: EnterpriseExecutionPolicyStatus;
  severity: EnterpriseExecutionPolicySeverity;
  version: number;
  priority: number;
  scope: EnterpriseExecutionPolicyScope;
  conditions: EnterpriseExecutionPolicyCondition[];
  effect: EnterpriseExecutionPolicyEffect;
  createdAt: string;
  updatedAt: string;
}