import {
  ExecutiveDemoFlowNavigation,
} from "./executiveDemoFlowNavigationTypes";
import {
  buildExecutiveDemoFlowNavigationSequence,
} from "./executiveDemoFlowNavigationSequence";

export interface ExecutiveDemoFlowNavigationSummary {
  flowId: string;
  companyName: string;
  title: string;
  status: string;
  currentStep: string | null;
  currentRoute: string | null;
  completedSteps: number;
  remainingSteps: number;
  totalSteps: number;
  completionPercentage: number;
  totalEstimatedMinutes: number;
  summary: string;
}

export function summarizeExecutiveDemoFlowNavigation(
  flow: ExecutiveDemoFlowNavigation,
): ExecutiveDemoFlowNavigationSummary {
  const sequence = buildExecutiveDemoFlowNavigationSequence(flow);
  const currentStep = flow.steps.find(
    (step) => step.id === flow.progress.currentStepId,
  );

  return {
    flowId: flow.id,
    companyName: flow.companyName,
    title: flow.title,
    status: flow.status,
    currentStep: currentStep?.title ?? null,
    currentRoute: currentStep?.route.path ?? null,
    completedSteps: flow.progress.completedStepIds.length,
    remainingSteps: flow.progress.remainingStepIds.length,
    totalSteps: flow.steps.length,
    completionPercentage: flow.progress.completionPercentage,
    totalEstimatedMinutes: sequence.totalEstimatedMinutes,
    summary:
      `${flow.companyName} executive demo is ${flow.status}. ` +
      `${flow.progress.completedStepIds.length} of ${flow.steps.length} steps are complete.`,
  };
}
