import { ExecutionAuthorizationContext } from "./executionAuthorizationContext";
import { ExecutionAuthorizationRecommendation } from "./executionAuthorizationRecommendationEngine";
import { ExecutionAuthorizationScoreCalculation } from "./executionAuthorizationScoreCalculator";
import { ExecutionAuthorizationValidation } from "./executionAuthorizationValidationEngine";

export interface ExecutionAuthorizationNarrative {
  headline: string;
  summary: string;
  authorizationPosition: string;
  executionGuidance: string;
}

export function buildExecutionAuthorizationNarrative(
  context: ExecutionAuthorizationContext,
  scoreCalculation: ExecutionAuthorizationScoreCalculation,
  validation: ExecutionAuthorizationValidation,
  recommendation: ExecutionAuthorizationRecommendation,
): ExecutionAuthorizationNarrative {
  const headline =
    recommendation.status === "authorized"
      ? "Execution is authorized"
      : recommendation.status === "conditionally_authorized"
        ? "Execution is conditionally authorized"
        : recommendation.status === "expired"
          ? "Execution authorization has expired"
          : recommendation.status === "denied"
            ? "Execution authorization is denied"
            : "Execution authorization is pending";

  const authorizationPosition =
    `Execution "${context.executionTitle}" received an authorization score of ` +
    `${scoreCalculation.authorizationScore}% with confidence of ` +
    `${scoreCalculation.confidenceScore}%.`;

  const validationSummary =
    validation.validationMessages.length > 0
      ? ` Validation findings: ${validation.validationMessages.join(" ")}`
      : " All required authorization validations passed.";

  return {
    headline,
    summary:
      `${recommendation.executiveSummary}${validationSummary}`,
    authorizationPosition,
    executionGuidance: recommendation.recommendedAction,
  };
}
