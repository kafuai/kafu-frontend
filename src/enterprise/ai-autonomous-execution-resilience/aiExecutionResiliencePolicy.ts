import {
  AIExecutionResilienceRecommendation,
} from "./aiExecutionResilienceTypes";
import { AIExecutionResilienceAssessment } from "./aiExecutionResilienceAssessment";

export interface AIExecutionResiliencePolicy {
  allowExecution: boolean;
  requireEscalation: boolean;
  requireFallback: boolean;
  recommendations: AIExecutionResilienceRecommendation[];
}

export function createAIExecutionResiliencePolicy(
  assessment: AIExecutionResilienceAssessment,
): AIExecutionResiliencePolicy {
  const actions = assessment.recommendations.map((r) => r.action);

  return {
    allowExecution: !actions.includes("pause_execution"),
    requireEscalation: actions.includes("escalate"),
    requireFallback: actions.includes("activate_fallback"),
    recommendations: assessment.recommendations,
  };
}