import { AIGovernanceRiskLevel, AIUseCaseCategory } from "./aiGovernanceTypes";

export type AIGuardrailAction =
  | "allow"
  | "warn"
  | "require_review"
  | "block";

export interface AIGuardrailRule {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  appliesToCategories: AIUseCaseCategory[];
  minimumRiskLevel: AIGovernanceRiskLevel;
  action: AIGuardrailAction;
  enabled: boolean;
}

export interface AIGuardrailEvaluationInput {
  category: AIUseCaseCategory;
  riskLevel: AIGovernanceRiskLevel;
  rules: AIGuardrailRule[];
}

export interface AIGuardrailEvaluationResult {
  action: AIGuardrailAction;
  matchedRules: AIGuardrailRule[];
  reasons: string[];
}

const riskRank: Record<AIGovernanceRiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const actionRank: Record<AIGuardrailAction, number> = {
  allow: 1,
  warn: 2,
  require_review: 3,
  block: 4,
};

export function evaluateAIGuardrails(
  input: AIGuardrailEvaluationInput,
): AIGuardrailEvaluationResult {
  const matchedRules = input.rules.filter(
    (rule) =>
      rule.enabled &&
      rule.appliesToCategories.includes(input.category) &&
      riskRank[input.riskLevel] >= riskRank[rule.minimumRiskLevel],
  );

  const action = matchedRules.reduce<AIGuardrailAction>(
    (current, rule) =>
      actionRank[rule.action] > actionRank[current] ? rule.action : current,
    "allow",
  );

  return {
    action,
    matchedRules,
    reasons: matchedRules.map((rule) => rule.description),
  };
}