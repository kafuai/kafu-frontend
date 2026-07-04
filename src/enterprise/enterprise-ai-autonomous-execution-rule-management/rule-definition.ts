import {
  EnterpriseRuleActionType,
  EnterpriseRuleConditionOperator,
  EnterpriseRuleId,
  EnterpriseRulePriority,
  EnterpriseRuleScope,
  EnterpriseRuleStatus,
} from "./rule-types";

export interface EnterpriseRuleCondition {
  field: string;
  operator: EnterpriseRuleConditionOperator;
  value?: unknown;
}

export interface EnterpriseRuleAction {
  type: EnterpriseRuleActionType;
  message?: string;
  target?: string;
  metadata?: Record<string, unknown>;
}

export interface EnterpriseRuleDefinition {
  id: EnterpriseRuleId;
  name: string;
  description: string;
  status: EnterpriseRuleStatus;
  priority: EnterpriseRulePriority;
  scope: EnterpriseRuleScope;
  conditions: EnterpriseRuleCondition[];
  actions: EnterpriseRuleAction[];
  createdAt: Date;
  updatedAt: Date;
  version: number;
  owner?: string;
  tags?: string[];
  metadata?: Record<string, unknown>;
}

export function createEnterpriseRuleDefinition(
  input: Omit<
    EnterpriseRuleDefinition,
    "createdAt" | "updatedAt" | "version"
  >,
): EnterpriseRuleDefinition {
  const now = new Date();

  return {
    ...input,
    createdAt: now,
    updatedAt: now,
    version: 1,
  };
}

export function updateEnterpriseRuleDefinition(
  rule: EnterpriseRuleDefinition,
  updates: Partial<
    Omit<
      EnterpriseRuleDefinition,
      "id" | "createdAt" | "updatedAt" | "version"
    >
  >,
): EnterpriseRuleDefinition {
  return {
    ...rule,
    ...updates,
    updatedAt: new Date(),
    version: rule.version + 1,
  };
}