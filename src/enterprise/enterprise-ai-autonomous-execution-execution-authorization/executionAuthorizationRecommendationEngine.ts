import { ExecutionAuthorizationContext } from "./executionAuthorizationContext";
import { ExecutionAuthorizationScoreCalculation } from "./executionAuthorizationScoreCalculator";
import { ExecutionAuthorizationValidation } from "./executionAuthorizationValidationEngine";
import { ExecutionAuthorizationStatus } from "./executionAuthorizationTypes";

export interface ExecutionAuthorizationRecommendation {
  status: ExecutionAuthorizationStatus;
  authorized: boolean;
  executiveSummary: string;
  recommendedAction: string;
}

export function buildExecutionAuthorizationRecommendation(
  context: ExecutionAuthorizationContext,
  scoreCalculation: ExecutionAuthorizationScoreCalculation,
  validation: ExecutionAuthorizationValidation,
): ExecutionAuthorizationRecommendation {
  if (validation.status === "expired") {
    return {
      status: "expired",
      authorized: false,
      executiveSummary:
        "The execution authorization has expired and can no longer be used.",
      recommendedAction:
        "Generate a new authorization request before execution.",
    };
  }

  if (validation.status === "denied") {
    return {
      status: "denied",
      authorized: false,
      executiveSummary:
        `Execution authorization is denied because ${validation.validationMessages.join(" ")}`,
      recommendedAction:
        "Resolve all blocking controls, conditions, dependencies and obtain executive approval before requesting authorization again.",
    };
  }

  if (validation.status === "conditionally_authorized") {
    return {
      status: "conditionally_authorized",
      authorized: true,
      executiveSummary:
        `Execution is conditionally authorized with an authorization score of ${scoreCalculation.authorizationScore}% and confidence of ${scoreCalculation.confidenceScore}%.`,
      recommendedAction:
        "Proceed only after monitoring all required conditions throughout execution.",
    };
  }

  if (validation.status === "authorized") {
    return {
      status: "authorized",
      authorized: true,
      executiveSummary:
        `Execution is fully authorized with an authorization score of ${scoreCalculation.authorizationScore}% and confidence of ${scoreCalculation.confidenceScore}%.`,
      recommendedAction:
        context.requiresContinuousMonitoring
          ? "Begin execution and activate continuous enterprise monitoring."
          : "Begin execution immediately.",
    };
  }

  return {
    status: "pending",
    authorized: false,
    executiveSummary:
      "Execution authorization remains pending further validation.",
    recommendedAction:
      "Complete the authorization process before execution.",
  };
}
