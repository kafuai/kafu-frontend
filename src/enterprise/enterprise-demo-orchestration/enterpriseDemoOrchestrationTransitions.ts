import {
  EnterpriseDemoOrchestrationPlan,
  EnterpriseDemoOrchestrationStep,
  EnterpriseDemoOrchestrationStepStatus,
} from "./enterpriseDemoOrchestrationTypes";

export function updateEnterpriseDemoOrchestrationStepStatus(
  plan: EnterpriseDemoOrchestrationPlan,
  stepId: string,
  status: EnterpriseDemoOrchestrationStepStatus,
): EnterpriseDemoOrchestrationPlan {
  const timestamp = new Date().toISOString();

  const steps = plan.steps.map((step): EnterpriseDemoOrchestrationStep => {
    if (step.id !== stepId) {
      return step;
    }

    return {
      ...step,
      status,
    };
  });

  return {
    ...plan,
    steps,
    updatedAt: timestamp,
  };
}

export function activateEnterpriseDemoOrchestrationStep(
  plan: EnterpriseDemoOrchestrationPlan,
  stepId: string,
): EnterpriseDemoOrchestrationPlan {
  const targetStep = plan.steps.find((step) => step.id === stepId);

  if (!targetStep) {
    throw new Error(`Orchestration step not found: ${stepId}.`);
  }

  const updatedPlan = updateEnterpriseDemoOrchestrationStepStatus(
    plan,
    stepId,
    "running",
  );

  return {
    ...updatedPlan,
    status: "running",
    currentStepId: stepId,
    updatedAt: new Date().toISOString(),
  };
}

export function completeEnterpriseDemoOrchestrationStep(
  plan: EnterpriseDemoOrchestrationPlan,
  stepId: string,
): EnterpriseDemoOrchestrationPlan {
  return updateEnterpriseDemoOrchestrationStepStatus(
    plan,
    stepId,
    "completed",
  );
}

export function failEnterpriseDemoOrchestrationStep(
  plan: EnterpriseDemoOrchestrationPlan,
  stepId: string,
): EnterpriseDemoOrchestrationPlan {
  const updatedPlan = updateEnterpriseDemoOrchestrationStepStatus(
    plan,
    stepId,
    "failed",
  );

  return {
    ...updatedPlan,
    status: "failed",
    currentStepId: stepId,
    updatedAt: new Date().toISOString(),
  };
}
