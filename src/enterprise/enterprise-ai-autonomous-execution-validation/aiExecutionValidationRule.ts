import {
  AIExecutionValidationCategory,
  AIExecutionValidationEvidence,
  AIExecutionValidationSeverity,
} from "./aiAutonomousExecutionValidationTypes";
import {
  AIExecutionValidationFinding,
  createAIExecutionValidationFinding,
} from "./aiExecutionValidationFinding";

export interface AIExecutionValidationRuleInput {
  ruleId: string;
  category: AIExecutionValidationCategory;
  label: string;
  passed: boolean;
  severityOnFailure: AIExecutionValidationSeverity;
  description: string;
  recommendation: string;
  evidence?: AIExecutionValidationEvidence[];
}

export interface AIExecutionValidationRuleResult {
  ruleId: string;
  category: AIExecutionValidationCategory;
  label: string;
  passed: boolean;
  finding?: AIExecutionValidationFinding;
}

export function evaluateAIExecutionValidationRule(
  input: AIExecutionValidationRuleInput
): AIExecutionValidationRuleResult {
  if (input.passed) {
    return {
      ruleId: input.ruleId,
      category: input.category,
      label: input.label,
      passed: true,
    };
  }

  return {
    ruleId: input.ruleId,
    category: input.category,
    label: input.label,
    passed: false,
    finding: createAIExecutionValidationFinding({
      findingId: `${input.ruleId}-finding`,
      category: input.category,
      severity: input.severityOnFailure,
      title: input.label,
      description: input.description,
      recommendation: input.recommendation,
      evidence: input.evidence ?? [],
    }),
  };
}