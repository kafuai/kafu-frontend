import { EnterpriseDemoOrchestrationContext } from "./enterpriseDemoOrchestrationContext";
import {
  EnterpriseDemoOrchestrationCoordinator,
  EnterpriseDemoOrchestrationCoordinationResult,
} from "./enterpriseDemoOrchestrationCoordinator";
import { createEnterpriseDemoOrchestration } from "./enterpriseDemoOrchestrationFactory";
import {
  cancelEnterpriseDemoOrchestration,
  pauseEnterpriseDemoOrchestration,
  resetEnterpriseDemoOrchestration,
  resumeEnterpriseDemoOrchestration,
} from "./enterpriseDemoOrchestrationLifecycle";
import {
  EnterpriseDemoOrchestrationInput,
  EnterpriseDemoOrchestrationResult,
} from "./enterpriseDemoOrchestrationTypes";

export class EnterpriseDemoOrchestrationEngine {
  private readonly coordinator: EnterpriseDemoOrchestrationCoordinator;

  constructor(
    coordinator?: EnterpriseDemoOrchestrationCoordinator,
  ) {
    this.coordinator =
      coordinator ??
      createEnterpriseDemoOrchestration().coordinator;
  }

  prepare(
    input: EnterpriseDemoOrchestrationInput,
  ): EnterpriseDemoOrchestrationCoordinationResult {
    return this.coordinator.prepare(input);
  }

  start(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationCoordinationResult {
    return this.coordinator.start(context);
  }

  advance(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationCoordinationResult {
    return this.coordinator.advance(context);
  }

  fail(
    context: EnterpriseDemoOrchestrationContext,
    reason: string,
  ): EnterpriseDemoOrchestrationCoordinationResult {
    return this.coordinator.fail(context, reason);
  }

  pause(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationContext {
    return pauseEnterpriseDemoOrchestration(context);
  }

  resume(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationContext {
    return resumeEnterpriseDemoOrchestration(context);
  }

  cancel(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationContext {
    return cancelEnterpriseDemoOrchestration(context);
  }

  reset(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationContext {
    return resetEnterpriseDemoOrchestration(context);
  }

  getResult(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationResult {
    return this.coordinator
      .prepare(context.input)
      .result.status === context.status
      ? {
          success: context.status === "completed",
          orchestrationId: context.plan.id,
          status: context.status,
          currentStepId: context.plan.currentStepId,
          completedSteps: context.plan.steps.filter(
            (step) =>
              step.status === "completed" ||
              step.status === "skipped",
          ).length,
          totalSteps: context.plan.steps.length,
          progressPercentage:
            context.plan.steps.length > 0
              ? Math.round(
                  (context.plan.steps.filter(
                    (step) =>
                      step.status === "completed" ||
                      step.status === "skipped",
                  ).length /
                    context.plan.steps.length) *
                    100,
                )
              : 0,
          message: `Enterprise demo orchestration is ${context.status}.`,
        }
      : {
          success: false,
          orchestrationId: context.plan.id,
          status: context.status,
          currentStepId: context.plan.currentStepId,
          completedSteps: 0,
          totalSteps: context.plan.steps.length,
          progressPercentage: 0,
          message: "Enterprise demo orchestration result unavailable.",
        };
  }
}
