import { AIExecutionResilienceAssessment } from "./aiExecutionResilienceAssessment";
import {
  AIExecutionResilienceAction,
  AIExecutionResilienceRecommendation,
} from "./aiExecutionResilienceTypes";

export interface AIExecutionResiliencePlanStep {
  id: string;
  action: AIExecutionResilienceAction;
  priority: number;
  reason: string;
}

export interface AIExecutionResiliencePlan {
  executionId: string;
  steps: AIExecutionResiliencePlanStep[];
  createdAt: Date;
}

export function createAIExecutionResiliencePlan(
  assessment: AIExecutionResilienceAssessment,
): AIExecutionResiliencePlan {
  const steps = assessment.recommendations.map(
    (recommendation: AIExecutionResilienceRecommendation, index) => ({
      id: `${assessment.profile.executionId}-resilience-step-${index + 1}`,
      action: recommendation.action,
      priority: recommendation.priority,
      reason: recommendation.reason,
    }),
  );

  return {
    executionId: assessment.profile.executionId,
    steps,
    createdAt: new Date(),
  };
}