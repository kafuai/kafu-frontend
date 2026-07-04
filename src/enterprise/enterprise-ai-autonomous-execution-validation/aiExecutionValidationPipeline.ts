import {
  AIExecutionValidationContext,
  AIExecutionValidationMetrics,
  AIExecutionValidationSummary,
} from "./aiAutonomousExecutionValidationTypes";
import { AIExecutionValidationRuleResult } from "./aiExecutionValidationRule";
import { validateAIExecution } from "./aiExecutionValidator";
import { scoreAIExecutionValidation } from "./aiExecutionValidationScoring";
import { determineAIExecutionValidationDecision } from "./aiExecutionValidationDecision";

export interface AIExecutionValidationPipelineResult {
  score: number;
  summary: AIExecutionValidationSummary;
  validation: ReturnType<typeof validateAIExecution>;
}

export function runAIExecutionValidationPipeline(
  context: AIExecutionValidationContext,
  metrics: AIExecutionValidationMetrics,
  rules: AIExecutionValidationRuleResult[]
): AIExecutionValidationPipelineResult {
  const validation = validateAIExecution(context, metrics, rules);
  const score = scoreAIExecutionValidation(metrics);
  const decision = determineAIExecutionValidationDecision(validation, score);

  const blockingIssueCount = validation.findings.filter(
    (f) => f.severity === "blocking"
  ).length;

  const criticalIssueCount = validation.findings.filter(
    (f) => f.severity === "critical"
  ).length;

  const warningIssueCount = validation.findings.filter(
    (f) => f.severity === "warning"
  ).length;

  return {
    score,
    validation,
    summary: {
      status:
        decision === "approved"
          ? "valid"
          : decision === "approved_with_warnings"
          ? "partially_valid"
          : decision === "manual_review_required"
          ? "requires_review"
          : "invalid",
      decision,
      confidence: score,
      blockingIssueCount,
      criticalIssueCount,
      warningIssueCount,
      passedRuleCount: validation.passedRules,
      failedRuleCount: validation.failedRules,
    },
  };
}