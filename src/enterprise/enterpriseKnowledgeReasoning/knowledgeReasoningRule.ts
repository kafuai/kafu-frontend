import {
  KnowledgeReasoningConfidence,
  KnowledgeReasoningSeverity,
} from "./knowledgeReasoningTypes";

export interface KnowledgeReasoningRuleCondition {
  readonly field: string;
  readonly operator: "equals" | "not_equals" | "contains" | "exists";
  readonly value?: string;
}

export interface KnowledgeReasoningRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly conditions: readonly KnowledgeReasoningRuleCondition[];
  readonly conclusion: string;
  readonly confidence: KnowledgeReasoningConfidence;
  readonly severity: KnowledgeReasoningSeverity;
}

export function createKnowledgeReasoningRule(
  rule: KnowledgeReasoningRule,
): KnowledgeReasoningRule {
  return {
    ...rule,
    conditions: [...rule.conditions],
  };
}