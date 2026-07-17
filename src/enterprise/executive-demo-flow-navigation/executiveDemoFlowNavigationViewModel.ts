import {
  ExecutiveDemoFlowNavigation,
} from "./executiveDemoFlowNavigationTypes";
import {
  summarizeExecutiveDemoFlowNavigation,
} from "./executiveDemoFlowNavigationSummary";

export interface ExecutiveDemoFlowNavigationViewStep {
  id: string;
  order: number;
  title: string;
  description: string;
  route: string;
  type: string;
  status: "completed" | "current" | "upcoming";
  required: boolean;
  estimatedMinutes: number;
}

export interface ExecutiveDemoFlowNavigationViewModel {
  id: string;
  companyName: string;
  heading: string;
  subheading: string;
  statusLabel: string;
  progressLabel: string;
  completionPercentage: number;
  currentStepTitle: string | null;
  currentRoute: string | null;
  steps: ExecutiveDemoFlowNavigationViewStep[];
  canGoPrevious: boolean;
  canGoNext: boolean;
  footerSummary: string;
}

export function buildExecutiveDemoFlowNavigationViewModel(
  flow: ExecutiveDemoFlowNavigation,
): ExecutiveDemoFlowNavigationViewModel {
  const summary = summarizeExecutiveDemoFlowNavigation(flow);
  const currentIndex = flow.progress.currentStepIndex;

  return {
    id: flow.id,
    companyName: flow.companyName,
    heading: flow.title,
    subheading: "Executive demo journey and presentation navigation",
    statusLabel: flow.status.replace(/-/g, " "),
    progressLabel:
      `${summary.completedSteps} of ${summary.totalSteps} steps completed`,
    completionPercentage: summary.completionPercentage,
    currentStepTitle: summary.currentStep,
    currentRoute: summary.currentRoute,
    steps: flow.steps.map((step, index) => ({
      id: step.id,
      order: step.order,
      title: step.title,
      description: step.description,
      route: step.route.path,
      type: step.type.replace(/-/g, " "),
      status:
        index < currentIndex
          ? "completed"
          : index === currentIndex
            ? "current"
            : "upcoming",
      required: step.required,
      estimatedMinutes: step.estimatedMinutes ?? 0,
    })),
    canGoPrevious: currentIndex > 0,
    canGoNext:
      currentIndex >= 0 &&
      currentIndex < flow.steps.length - 1,
    footerSummary:
      `${summary.summary} Estimated presentation duration: ` +
      `${summary.totalEstimatedMinutes} minutes.`,
  };
}
