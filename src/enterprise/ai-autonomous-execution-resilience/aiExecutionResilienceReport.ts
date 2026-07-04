import { AIExecutionResilienceAssessment } from "./aiExecutionResilienceAssessment";
import { AIExecutionResiliencePlan } from "./aiExecutionResiliencePlanner";

export interface AIExecutionResilienceReport {
  executionId: string;
  level: string;
  risk: string;
  overallScore: number;
  signalCount: number;
  recommendationCount: number;
  planStepCount: number;
  summary: string;
  generatedAt: Date;
}

export function createAIExecutionResilienceReport(input: {
  assessment: AIExecutionResilienceAssessment;
  plan: AIExecutionResiliencePlan;
  generatedAt?: Date;
}): AIExecutionResilienceReport {
  const { profile, recommendations } = input.assessment;

  return {
    executionId: profile.executionId,
    level: profile.level,
    risk: profile.risk,
    overallScore: profile.score.overall,
    signalCount: profile.signals.length,
    recommendationCount: recommendations.length,
    planStepCount: input.plan.steps.length,
    summary: `Execution ${profile.executionId} resilience is ${profile.level} with ${profile.risk} risk.`,
    generatedAt: input.generatedAt ?? new Date(),
  };
}