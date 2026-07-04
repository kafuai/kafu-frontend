import {
  AIExecutionValidationContext,
  AIExecutionValidationMetrics,
} from "./aiAutonomousExecutionValidationTypes";
import {
  AIExecutionValidationFinding,
} from "./aiExecutionValidationFinding";
import {
  AIExecutionValidationRuleResult,
} from "./aiExecutionValidationRule";

export interface AIExecutionValidationResult {
  context: AIExecutionValidationContext;
  metrics: AIExecutionValidationMetrics;
  findings: AIExecutionValidationFinding[];
  passedRules: number;
  failedRules: number;
}

export function validateAIExecution(
  context: AIExecutionValidationContext,
  metrics: AIExecutionValidationMetrics,
  rules: AIExecutionValidationRuleResult[]
): AIExecutionValidationResult {
  const findings = rules
    .filter((r) => !r.passed && r.finding)
    .map((r) => r.finding!) as AIExecutionValidationFinding[];

  return {
    context,
    metrics,
    findings,
    passedRules: rules.filter((r) => r.passed).length,
    failedRules: rules.filter((r) => !r.passed).length,
  };
}