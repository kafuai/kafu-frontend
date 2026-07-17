import {
  ExecutiveDemoFlowNavigation,
  ExecutiveDemoFlowNavigationInput,
  ExecutiveDemoFlowNavigationProgress,
  ExecutiveDemoFlowNavigationStep,
  ExecutiveDemoFlowNavigationTransition,
} from "./executiveDemoFlowNavigationTypes";

function createFlowId(organizationId: string): string {
  const normalizedOrganizationId = organizationId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return `executive-demo-flow-${normalizedOrganizationId || "organization"}-${Date.now()}`;
}

function buildInitialProgress(
  steps: ExecutiveDemoFlowNavigationStep[],
): ExecutiveDemoFlowNavigationProgress {
  return {
    currentStepId: steps[0]?.id ?? null,
    currentStepIndex: steps.length > 0 ? 0 : -1,
    completedStepIds: [],
    remainingStepIds: steps.map((step) => step.id),
    completionPercentage: 0,
  };
}

function buildTransitions(
  steps: ExecutiveDemoFlowNavigationStep[],
): ExecutiveDemoFlowNavigationTransition[] {
  const transitions: ExecutiveDemoFlowNavigationTransition[] = [];

  for (let index = 0; index < steps.length - 1; index += 1) {
    const currentStep = steps[index];
    const nextStep = steps[index + 1];

    transitions.push({
      id: `transition-${currentStep.id}-${nextStep.id}`,
      fromStepId: currentStep.id,
      toStepId: nextStep.id,
      direction: "forward",
      allowed: true,
    });

    transitions.push({
      id: `transition-${nextStep.id}-${currentStep.id}`,
      fromStepId: nextStep.id,
      toStepId: currentStep.id,
      direction: "backward",
      allowed: true,
    });
  }

  return transitions;
}

export function createExecutiveDemoFlowNavigation(
  input: ExecutiveDemoFlowNavigationInput,
): ExecutiveDemoFlowNavigation {
  const timestamp = new Date().toISOString();
  const orderedSteps = [...input.steps].sort(
    (firstStep, secondStep) => firstStep.order - secondStep.order,
  );

  return {
    id: createFlowId(input.organizationId),
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    title:
      input.title?.trim() ||
      `${input.companyName.trim()} Executive Demo Flow`,
    status: "ready",
    steps: orderedSteps,
    transitions: buildTransitions(orderedSteps),
    progress: buildInitialProgress(orderedSteps),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function startExecutiveDemoFlowNavigation(
  flow: ExecutiveDemoFlowNavigation,
): ExecutiveDemoFlowNavigation {
  const timestamp = new Date().toISOString();

  return {
    ...flow,
    status: "in-progress",
    startedAt: flow.startedAt ?? timestamp,
    updatedAt: timestamp,
  };
}

export function pauseExecutiveDemoFlowNavigation(
  flow: ExecutiveDemoFlowNavigation,
): ExecutiveDemoFlowNavigation {
  return {
    ...flow,
    status: "paused",
    updatedAt: new Date().toISOString(),
  };
}

export function completeExecutiveDemoFlowNavigation(
  flow: ExecutiveDemoFlowNavigation,
): ExecutiveDemoFlowNavigation {
  const timestamp = new Date().toISOString();

  return {
    ...flow,
    status: "completed",
    progress: {
      currentStepId: flow.steps.at(-1)?.id ?? null,
      currentStepIndex: flow.steps.length - 1,
      completedStepIds: flow.steps.map((step) => step.id),
      remainingStepIds: [],
      completionPercentage: flow.steps.length > 0 ? 100 : 0,
    },
    completedAt: timestamp,
    updatedAt: timestamp,
  };
}
