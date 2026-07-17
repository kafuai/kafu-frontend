import { ExecutionActivationContext } from "./executionActivationContext";
import { ExecutionActivationScoreCalculation } from "./executionActivationScoreCalculator";
import { ExecutionActivationStatus } from "./executionActivationTypes";

export interface ExecutionActivationValidation {
  status: ExecutionActivationStatus;
  activated: boolean;

  failedRequiredGates: string[];
  blockingDependencies: string[];
  incompleteMandatoryCheckpoints: string[];

  validationMessages: string[];
}

export function validateExecutionActivation(
  context: ExecutionActivationContext,
  scoreCalculation: ExecutionActivationScoreCalculation,
): ExecutionActivationValidation {
  const failedRequiredGates = context.gates
    .filter(
      (gate) =>
        gate.required &&
        !gate.passed,
    )
    .map((gate) => gate.title);

  const blockingDependencies =
    context.dependencies
      .filter(
        (dependency) =>
          dependency.blocking &&
          !dependency.resolved,
      )
      .map((dependency) => dependency.title);

  const incompleteMandatoryCheckpoints =
    context.checkpoints
      .filter(
        (checkpoint) =>
          checkpoint.mandatory &&
          !checkpoint.completed,
      )
      .map((checkpoint) => checkpoint.title);

  const validationMessages: string[] = [];

  if (!context.executionAuthorized) {
    validationMessages.push(
      "Execution authorization has not been granted.",
    );
  }

  if (failedRequiredGates.length > 0) {
    validationMessages.push(
      `${failedRequiredGates.length} required activation gate(s) failed.`,
    );
  }

  if (blockingDependencies.length > 0) {
    validationMessages.push(
      `${blockingDependencies.length} blocking dependency(ies) remain unresolved.`,
    );
  }

  if (
    incompleteMandatoryCheckpoints.length > 0
  ) {
    validationMessages.push(
      `${incompleteMandatoryCheckpoints.length} mandatory checkpoint(s) remain incomplete.`,
    );
  }

  const now = new Date();

  if (
    context.activationWindow?.endsAt &&
    new Date(context.activationWindow.endsAt) < now
  ) {
    validationMessages.push(
      "The execution activation window has expired.",
    );

    return {
      status: "failed",
      activated: false,
      failedRequiredGates,
      blockingDependencies,
      incompleteMandatoryCheckpoints,
      validationMessages,
    };
  }

  if (
    context.activationWindow?.startsAt &&
    new Date(context.activationWindow.startsAt) > now
  ) {
    validationMessages.push(
      "The scheduled execution activation window has not started.",
    );

    return {
      status: "pending",
      activated: false,
      failedRequiredGates,
      blockingDependencies,
      incompleteMandatoryCheckpoints,
      validationMessages,
    };
  }

  if (
    !context.executionAuthorized ||
    failedRequiredGates.length > 0 ||
    blockingDependencies.length > 0 ||
    incompleteMandatoryCheckpoints.length > 0
  ) {
    return {
      status: "blocked",
      activated: false,
      failedRequiredGates,
      blockingDependencies,
      incompleteMandatoryCheckpoints,
      validationMessages,
    };
  }

  if (context.requiresManualRelease) {
    validationMessages.push(
      "Manual release is required before execution activation.",
    );

    return {
      status: "ready",
      activated: false,
      failedRequiredGates,
      blockingDependencies,
      incompleteMandatoryCheckpoints,
      validationMessages,
    };
  }

  if (scoreCalculation.activationScore >= 80) {
    return {
      status: "activated",
      activated: true,
      failedRequiredGates,
      blockingDependencies,
      incompleteMandatoryCheckpoints,
      validationMessages,
    };
  }

  if (scoreCalculation.activationScore >= 60) {
    validationMessages.push(
      "Execution is activated with additional monitoring conditions.",
    );

    return {
      status: "conditionally_activated",
      activated: true,
      failedRequiredGates,
      blockingDependencies,
      incompleteMandatoryCheckpoints,
      validationMessages,
    };
  }

  validationMessages.push(
    "Activation readiness is below the minimum threshold.",
  );

  return {
    status: "blocked",
    activated: false,
    failedRequiredGates,
    blockingDependencies,
    incompleteMandatoryCheckpoints,
    validationMessages,
  };
}
