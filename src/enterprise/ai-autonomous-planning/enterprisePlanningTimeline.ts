import { EnterprisePlanningStep } from "./enterpriseAIPlanningEngineTypes";

export interface EnterprisePlanningTimelineItem {
  stepId: string;
  order: number;
  estimatedDays: number;
}

export function buildEnterprisePlanningTimeline(
  steps: EnterprisePlanningStep[]
): EnterprisePlanningTimelineItem[] {
  return steps.map((step) => ({
    stepId: step.id,
    order: step.sequence,
    estimatedDays: 5,
  }));
}