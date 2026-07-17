import { ExecutionAuthorizationContext } from "./executionAuthorizationContext";
import { ExecutionAuthorizationScoreCalculation } from "./executionAuthorizationScoreCalculator";
import { ExecutionAuthorizationStatus } from "./executionAuthorizationTypes";

export interface ExecutionAuthorizationValidation {
  status: ExecutionAuthorizationStatus;
  authorized: boolean;

  blockingControls: string[];
  blockingConditions: string[];
  blockingDependencies: string[];

  validationMessages: string[];
}

export function validateExecutionAuthorization(
  context: ExecutionAuthorizationContext,
  scoreCalculation: ExecutionAuthorizationScoreCalculation,
): ExecutionAuthorizationValidation {
  const blockingControls = context.controls
    .filter(
      (control) =>
        control.required &&
        !control.passed,
    )
    .map((control) => control.title);

  const blockingConditions = context.conditions
    .filter(
      (condition) =>
        condition.blocking &&
        !condition.satisfied,
    )
    .map((condition) => condition.title);

  const blockingDependencies = context.dependencies
    .filter(
      (dependency) =>
        dependency.blocking &&
        !dependency.resolved,
    )
    .map((dependency) => dependency.title);

  const validationMessages: string[] = [];

  if (!context.executiveApprovalGranted) {
    validationMessages.push(
      "Executive approval has not been granted.",
    );
  }

  if (blockingControls.length > 0) {
    validationMessages.push(
      `${blockingControls.length} required control(s) failed.`,
    );
  }

  if (blockingConditions.length > 0) {
    validationMessages.push(
      `${blockingConditions.length} blocking condition(s) remain unresolved.`,
    );
  }

  if (blockingDependencies.length > 0) {
    validationMessages.push(
      `${blockingDependencies.length} blocking dependency(ies) remain unresolved.`,
    );
  }

  if (
    context.authorizationWindow?.expiresAt &&
    new Date(context.authorizationWindow.expiresAt) <
      new Date()
  ) {
    validationMessages.push(
      "Authorization window has expired.",
    );

    return {
      status: "expired",
      authorized: false,
      blockingControls,
      blockingConditions,
      blockingDependencies,
      validationMessages,
    };
  }

  if (
    !context.executiveApprovalGranted ||
    blockingControls.length > 0 ||
    blockingConditions.length > 0 ||
    blockingDependencies.length > 0
  ) {
    return {
      status: "denied",
      authorized: false,
      blockingControls,
      blockingConditions,
      blockingDependencies,
      validationMessages,
    };
  }

  if (scoreCalculation.authorizationScore >= 80) {
    return {
      status: "authorized",
      authorized: true,
      blockingControls,
      blockingConditions,
      blockingDependencies,
      validationMessages,
    };
  }

  if (scoreCalculation.authorizationScore >= 60) {
    validationMessages.push(
      "Execution is authorized with conditions.",
    );

    return {
      status: "conditionally_authorized",
      authorized: true,
      blockingControls,
      blockingConditions,
      blockingDependencies,
      validationMessages,
    };
  }

  validationMessages.push(
    "Authorization score is below the minimum threshold.",
  );

  return {
    status: "denied",
    authorized: false,
    blockingControls,
    blockingConditions,
    blockingDependencies,
    validationMessages,
  };
}
