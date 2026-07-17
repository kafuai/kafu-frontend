import {
  startExecutiveDemoFlowNavigation,
} from "./executiveDemoFlowNavigation";
import {
  ExecutiveDemoFlowNavigationContext,
} from "./executiveDemoFlowNavigationContext";
import {
  ExecutiveDemoFlowNavigation,
  ExecutiveDemoFlowNavigationProgress,
  ExecutiveDemoFlowNavigationStep,
} from "./executiveDemoFlowNavigationTypes";
import {
  buildExecutiveDemoFlowNavigation,
} from "./executiveDemoFlowNavigationBuilder";
import {
  assertExecutiveDemoFlowNavigationValid,
} from "./executiveDemoFlowNavigationValidator";

export interface ExecutiveDemoFlowNavigationEngineInput {
  context: ExecutiveDemoFlowNavigationContext;
  title?: string;
  autoStart?: boolean;
}

function calculateProgress(
  steps: ExecutiveDemoFlowNavigationStep[],
  currentStepIndex: number,
): ExecutiveDemoFlowNavigationProgress {
  const normalizedIndex = Math.max(
    0,
    Math.min(currentStepIndex, Math.max(steps.length - 1, 0)),
  );

  const completedStepIds = steps
    .slice(0, normalizedIndex)
    .map((step) => step.id);

  const remainingStepIds = steps
    .slice(normalizedIndex)
    .map((step) => step.id);

  const completionPercentage =
    steps.length === 0
      ? 0
      : Math.round((completedStepIds.length / steps.length) * 100);

  return {
    currentStepId: steps[normalizedIndex]?.id ?? null,
    currentStepIndex: steps.length > 0 ? normalizedIndex : -1,
    completedStepIds,
    remainingStepIds,
    completionPercentage,
  };
}

export class ExecutiveDemoFlowNavigationEngine {
  create(
    input: ExecutiveDemoFlowNavigationEngineInput,
  ): ExecutiveDemoFlowNavigation {
    const flow = buildExecutiveDemoFlowNavigation({
      context: input.context,
      title: input.title,
    });

    return input.autoStart ?? true
      ? startExecutiveDemoFlowNavigation(flow)
      : flow;
  }

  moveToStep(
    flow: ExecutiveDemoFlowNavigation,
    stepId: string,
  ): ExecutiveDemoFlowNavigation {
    const targetIndex = flow.steps.findIndex(
      (step) => step.id === stepId,
    );

    if (targetIndex < 0) {
      throw new Error(`Executive demo step not found: ${stepId}`);
    }

    const currentStepId = flow.progress.currentStepId;

    if (currentStepId) {
      const transitionAllowed = flow.transitions.some(
        (transition) =>
          transition.fromStepId === currentStepId &&
          transition.toStepId === stepId &&
          transition.allowed,
      );

      const isSameStep = currentStepId === stepId;

      if (!transitionAllowed && !isSameStep) {
        throw new Error(
          `Transition from ${currentStepId} to ${stepId} is not allowed.`,
        );
      }
    }

    const updatedFlow: ExecutiveDemoFlowNavigation = {
      ...flow,
      status: "in-progress",
      progress: calculateProgress(flow.steps, targetIndex),
      updatedAt: new Date().toISOString(),
    };

    assertExecutiveDemoFlowNavigationValid(updatedFlow);

    return updatedFlow;
  }

  next(
    flow: ExecutiveDemoFlowNavigation,
  ): ExecutiveDemoFlowNavigation {
    const nextIndex = flow.progress.currentStepIndex + 1;

    if (nextIndex >= flow.steps.length) {
      return flow;
    }

    return this.moveToStep(flow, flow.steps[nextIndex].id);
  }

  previous(
    flow: ExecutiveDemoFlowNavigation,
  ): ExecutiveDemoFlowNavigation {
    const previousIndex = flow.progress.currentStepIndex - 1;

    if (previousIndex < 0) {
      return flow;
    }

    return this.moveToStep(flow, flow.steps[previousIndex].id);
  }
}
