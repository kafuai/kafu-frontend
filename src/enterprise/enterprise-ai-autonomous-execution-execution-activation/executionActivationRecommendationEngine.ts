import { ExecutionActivationContext } from "./executionActivationContext";
import { ExecutionActivationScoreCalculation } from "./executionActivationScoreCalculator";
import { ExecutionActivationValidation } from "./executionActivationValidationEngine";
import { ExecutionActivationStatus } from "./executionActivationTypes";

export interface ExecutionActivationRecommendation {
  status: ExecutionActivationStatus;
  activated: boolean;
  executiveSummary: string;
  recommendedAction: string;
}

export function buildExecutionActivationRecommendation(
  context: ExecutionActivationContext,
  scoreCalculation: ExecutionActivationScoreCalculation,
  validation: ExecutionActivationValidation,
): ExecutionActivationRecommendation {
  if (validation.status === "failed") {
    return {
      status: "failed",
      activated: false,
      executiveSummary:
        "Execution activation failed because the permitted activation window has expired.",
      recommendedAction:
        "Create a new activation request and obtain a valid execution activation window.",
    };
  }

  if (validation.status === "pending") {
    return {
      status: "pending",
      activated: false,
      executiveSummary:
        "Execution activation is scheduled but the activation window has not started.",
      recommendedAction:
        "Wait until the scheduled activation window begins and validate readiness again.",
    };
  }

  if (validation.status === "blocked") {
    return {
      status: "blocked",
      activated: false,
      executiveSummary:
        `Execution activation is blocked. ${validation.validationMessages.join(" ")}`,
      recommendedAction:
        "Resolve failed activation gates, blocking dependencies, mandatory checkpoints, and authorization issues before retrying activation.",
    };
  }

  if (validation.status === "ready") {
    return {
      status: "ready",
      activated: false,
      executiveSummary:
        `Execution is ready for manual release with an activation score of ${scoreCalculation.activationScore}%.`,
      recommendedAction:
        "Obtain the required manual release and activate execution.",
    };
  }

  if (
    validation.status ===
    "conditionally_activated"
  ) {
    return {
      status: "conditionally_activated",
      activated: true,
      executiveSummary:
        `Execution is conditionally activated with an activation score of ${scoreCalculation.activationScore}% and confidence of ${scoreCalculation.confidenceScore}%.`,
      recommendedAction:
        "Proceed with execution while maintaining continuous monitoring and rollback readiness.",
    };
  }

  if (validation.status === "activated") {
    return {
      status: "activated",
      activated: true,
      executiveSummary:
        `Execution is activated with an activation score of ${scoreCalculation.activationScore}% and confidence of ${scoreCalculation.confidenceScore}%.`,
      recommendedAction:
        context.requiresContinuousMonitoring
          ? "Start execution and activate continuous operational monitoring."
          : "Start execution according to the approved activation mode.",
    };
  }

  return {
    status: "pending",
    activated: false,
    executiveSummary:
      "Execution activation remains pending.",
    recommendedAction:
      "Complete the activation validation process.",
  };
}
