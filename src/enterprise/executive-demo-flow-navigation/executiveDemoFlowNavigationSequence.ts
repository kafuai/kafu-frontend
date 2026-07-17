import {
  ExecutiveDemoFlowNavigation,
  ExecutiveDemoFlowNavigationStep,
} from "./executiveDemoFlowNavigationTypes";

export interface ExecutiveDemoFlowNavigationSequenceItem {
  position: number;
  stepId: string;
  title: string;
  route: string;
  type: string;
  required: boolean;
  estimatedMinutes: number;
  previousStepId: string | null;
  nextStepId: string | null;
}

export interface ExecutiveDemoFlowNavigationSequence {
  flowId: string;
  totalSteps: number;
  totalEstimatedMinutes: number;
  items: ExecutiveDemoFlowNavigationSequenceItem[];
}

function buildSequenceItem(
  step: ExecutiveDemoFlowNavigationStep,
  index: number,
  steps: ExecutiveDemoFlowNavigationStep[],
): ExecutiveDemoFlowNavigationSequenceItem {
  return {
    position: index + 1,
    stepId: step.id,
    title: step.title,
    route: step.route.path,
    type: step.type,
    required: step.required,
    estimatedMinutes: step.estimatedMinutes ?? 0,
    previousStepId: steps[index - 1]?.id ?? null,
    nextStepId: steps[index + 1]?.id ?? null,
  };
}

export function buildExecutiveDemoFlowNavigationSequence(
  flow: ExecutiveDemoFlowNavigation,
): ExecutiveDemoFlowNavigationSequence {
  const items = flow.steps.map((step, index) =>
    buildSequenceItem(step, index, flow.steps),
  );

  return {
    flowId: flow.id,
    totalSteps: items.length,
    totalEstimatedMinutes: items.reduce(
      (total, item) => total + item.estimatedMinutes,
      0,
    ),
    items,
  };
}
