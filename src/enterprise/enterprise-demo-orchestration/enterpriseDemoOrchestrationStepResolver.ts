import {
  EnterpriseDemoOrchestrationPlan,
  EnterpriseDemoOrchestrationStep,
} from "./enterpriseDemoOrchestrationTypes";

export function getEnterpriseDemoOrchestrationStep(
  plan: EnterpriseDemoOrchestrationPlan,
  stepId: string,
): EnterpriseDemoOrchestrationStep | null {
  return plan.steps.find((step) => step.id === stepId) ?? null;
}

export function getCurrentEnterpriseDemoOrchestrationStep(
  plan: EnterpriseDemoOrchestrationPlan,
): EnterpriseDemoOrchestrationStep | null {
  if (!plan.currentStepId) {
    return null;
  }

  return getEnterpriseDemoOrchestrationStep(plan, plan.currentStepId);
}

export function getNextEnterpriseDemoOrchestrationStep(
  plan: EnterpriseDemoOrchestrationPlan,
): EnterpriseDemoOrchestrationStep | null {
  const currentStep = getCurrentEnterpriseDemoOrchestrationStep(plan);

  if (!currentStep) {
    return (
      [...plan.steps]
        .sort((left, right) => left.sequence - right.sequence)
        .find((step) => step.status === "pending" || step.status === "ready") ??
      null
    );
  }

  return (
    [...plan.steps]
      .sort((left, right) => left.sequence - right.sequence)
      .find(
        (step) =>
          step.sequence > currentStep.sequence &&
          (step.status === "pending" || step.status === "ready"),
      ) ?? null
  );
}
