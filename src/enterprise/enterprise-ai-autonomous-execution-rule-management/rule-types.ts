export type EnterpriseRuleId = string;

export type EnterpriseRuleStatus =
  | "draft"
  | "active"
  | "inactive"
  | "deprecated"
  | "archived";

export type EnterpriseRulePriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type EnterpriseRuleScope =
  | "global"
  | "tenant"
  | "workspace"
  | "agent"
  | "workflow"
  | "task"
  | "operation";

export type EnterpriseRuleConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "greater_than_or_equal"
  | "less_than"
  | "less_than_or_equal"
  | "exists"
  | "not_exists"
  | "in"
  | "not_in";

export type EnterpriseRuleActionType =
  | "allow"
  | "deny"
  | "warn"
  | "require_approval"
  | "escalate"
  | "tag"
  | "log";

export type EnterpriseRuleEvaluationOutcome =
  | "matched"
  | "not_matched"
  | "skipped"
  | "error";

export interface EnterpriseRuleEvaluationContext {
  tenantId?: string;
  workspaceId?: string;
  agentId?: string;
  workflowId?: string;
  taskId?: string;
  operationId?: string;
  actorId?: string;
  resourceType?: string;
  resourceId?: string;
  attributes: Record<string, unknown>;
  timestamp: Date;
}

export interface EnterpriseRuleEvaluationResult {
  ruleId: EnterpriseRuleId;
  outcome: EnterpriseRuleEvaluationOutcome;
  matched: boolean;
  actions: EnterpriseRuleActionType[];
  reason: string;
  evaluatedAt: Date;
  metadata?: Record<string, unknown>;
}