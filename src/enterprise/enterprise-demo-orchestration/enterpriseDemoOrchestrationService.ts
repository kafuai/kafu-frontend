import {
  EnterpriseDemoOrchestrationContext,
  createEnterpriseDemoOrchestrationContext,
} from "./enterpriseDemoOrchestrationContext";
import { buildEnterpriseDemoOrchestrationPlan } from "./enterpriseDemoOrchestrationPlan";
import {
  EnterpriseDemoOrchestrationInput,
  EnterpriseDemoOrchestrationPlan,
  EnterpriseDemoOrchestrationResult,
} from "./enterpriseDemoOrchestrationTypes";
import {
  buildEnterpriseDemoOrchestrationResult,
  calculateEnterpriseDemoOrchestrationProgress,
} from "./enterpriseDemoOrchestrationResult";
import {
  activateEnterpriseDemoOrchestrationStep,
  completeEnterpriseDemoOrchestrationStep,
  failEnterpriseDemoOrchestrationStep,
} from "./enterpriseDemoOrchestrationTransitions";
import {
  getCurrentEnterpriseDemoOrchestrationStep,
  getNextEnterpriseDemoOrchestrationStep,
} from "./enterpriseDemoOrchestrationStepResolver";
import {
  validateEnterpriseDemoOrchestrationInput,
  validateEnterpriseDemoOrchestrationPlan,
} from "./enterpriseDemoOrchestrationValidator";

export class EnterpriseDemoOrchestrationService {
  createContext(
    input: EnterpriseDemoOrchestrationInput,
  ): EnterpriseDemoOrchestrationContext {
    const inputValidation =
      validateEnterpriseDemoOrchestrationInput(input);

    if (!inputValidation.valid) {
      throw new Error(inputValidation.errors.join(" "));
    }

    const plan = buildEnterpriseDemoOrchestrationPlan(input);
    const planValidation =
      validateEnterpriseDemoOrchestrationPlan(plan);

    if (!planValidation.valid) {
      throw new Error(planValidation.errors.join(" "));
    }

    return createEnterpriseDemoOrchestrationContext(input, plan);
  }

  start(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationContext {
    const currentStep =
      getCurrentEnterpriseDemoOrchestrationStep(context.plan);

    if (!currentStep) {
      throw new Error(
        "Enterprise demo orchestration has no current step.",
      );
    }

    const plan = activateEnterpriseDemoOrchestrationStep(
      context.plan,
      currentStep.id,
    );

    return {
      ...context,
      plan,
      status: plan.status,
      startedAt: context.startedAt ?? new Date().toISOString(),
      failureReason: null,
    };
  }

  completeCurrentStep(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationContext {
    const currentStep =
      getCurrentEnterpriseDemoOrchestrationStep(context.plan);

    if (!currentStep) {
      throw new Error(
        "Enterprise demo orchestration has no active step.",
      );
    }

    let plan = completeEnterpriseDemoOrchestrationStep(
      context.plan,
      currentStep.id,
    );

    const nextStep = getNextEnterpriseDemoOrchestrationStep(plan);

    if (!nextStep) {
      plan = {
        ...plan,
        status: "completed",
        currentStepId: null,
        updatedAt: new Date().toISOString(),
      };

      return {
        ...context,
        plan,
        status: "completed",
        completedAt: new Date().toISOString(),
        failureReason: null,
      };
    }

    plan = activateEnterpriseDemoOrchestrationStep(
      plan,
      nextStep.id,
    );

    return {
      ...context,
      plan,
      status: plan.status,
      failureReason: null,
    };
  }

  failCurrentStep(
    context: EnterpriseDemoOrchestrationContext,
    reason: string,
  ): EnterpriseDemoOrchestrationContext {
    const currentStep =
      getCurrentEnterpriseDemoOrchestrationStep(context.plan);

    if (!currentStep) {
      throw new Error(
        "Enterprise demo orchestration has no active step.",
      );
    }

    const plan = failEnterpriseDemoOrchestrationStep(
      context.plan,
      currentStep.id,
    );

    return {
      ...context,
      plan,
      status: "failed",
      failureReason: reason.trim() || "Unknown orchestration failure.",
    };
  }

  getResult(
    context: EnterpriseDemoOrchestrationContext,
  ): EnterpriseDemoOrchestrationResult {
    return buildEnterpriseDemoOrchestrationResult(context.plan);
  }

  getProgress(plan: EnterpriseDemoOrchestrationPlan): number {
    return calculateEnterpriseDemoOrchestrationProgress(plan);
  }
}
