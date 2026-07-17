import { ExecutionActivationContext } from "./executionActivationContext";
import { ExecutionActivationRecommendation } from "./executionActivationRecommendationEngine";
import { ExecutionActivationScoreCalculation } from "./executionActivationScoreCalculator";
import { ExecutionActivationValidation } from "./executionActivationValidationEngine";

export interface ExecutionActivationNarrative {
  headline: string;
  summary: string;
  activationPosition: string;
  executionGuidance: string;
}

export function buildExecutionActivationNarrative(
  context: ExecutionActivationContext,
  scoreCalculation: ExecutionActivationScoreCalculation,
  validation: ExecutionActivationValidation,
  recommendation: ExecutionActivationRecommendation,
): ExecutionActivationNarrative {
  const headline =
    recommendation.status === "activated"
      ? "Execution has been activated"
      : recommendation.status === "conditionally_activated"
        ? "Execution has been conditionally activated"
        : recommendation.status === "ready"
          ? "Execution is ready for manual release"
          : recommendation.status === "blocked"
            ? "Execution activation is blocked"
            : recommendation.status === "failed"
              ? "Execution activation failed"
              : "Execution activation is pending";

  const activationPosition =
    `Execution "${context.executionTitle}" received an activation score of ` +
    `${scoreCalculation.activationScore}% with confidence of ` +
    `${scoreCalculation.confidenceScore}%.`;

  const validationSummary =
    validation.validationMessages.length > 0
      ? ` Validation findings: ${validation.validationMessages.join(" ")}`
      : " All required activation validations passed.";

  return {
    headline,
    summary:
      `${recommendation.executiveSummary}${validationSummary}`,
    activationPosition,
    executionGuidance: recommendation.recommendedAction,
  };
}
