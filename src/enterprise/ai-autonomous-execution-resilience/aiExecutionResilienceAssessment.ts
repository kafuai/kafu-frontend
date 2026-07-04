import {
  AIExecutionResilienceRecommendation,
  AIExecutionResilienceSignal,
} from "./aiExecutionResilienceTypes";
import {
  AIExecutionResilienceProfile,
  createAIExecutionResilienceProfile,
} from "./aiExecutionResilienceProfile";

export interface AIExecutionResilienceAssessmentInput {
  executionId: string;
  stability: number;
  recoveryReadiness: number;
  fallbackReadiness: number;
  monitoringCoverage: number;
  retrySafety: number;
  signals?: AIExecutionResilienceSignal[];
}

export interface AIExecutionResilienceAssessment {
  profile: AIExecutionResilienceProfile;
  recommendations: AIExecutionResilienceRecommendation[];
}

export function assessAIExecutionResilience(
  input: AIExecutionResilienceAssessmentInput,
): AIExecutionResilienceAssessment {
  const profile = createAIExecutionResilienceProfile(input);

  const recommendations: AIExecutionResilienceRecommendation[] = [];

  if (profile.score.monitoringCoverage < 0.7) {
    recommendations.push({
      action: "increase_monitoring",
      priority: 100,
      reason: "Monitoring coverage below resilience target.",
    });
  }

  if (profile.score.fallbackReadiness < 0.7) {
    recommendations.push({
      action: "activate_fallback",
      priority: 95,
      reason: "Fallback readiness is insufficient.",
    });
  }

  if (profile.score.retrySafety < 0.65) {
    recommendations.push({
      action: "reduce_retry_pressure",
      priority: 90,
      reason: "Retry strategy may amplify failures.",
    });
  }

  if (profile.level === "critical") {
    recommendations.push({
      action: "pause_execution",
      priority: 1000,
      reason: "Execution resilience reached critical state.",
    });
  } else if (profile.level === "fragile") {
    recommendations.push({
      action: "escalate",
      priority: 500,
      reason: "Execution resilience is fragile.",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      action: "continue_execution",
      priority: 1,
      reason: "Execution resilience is healthy.",
    });
  }

  recommendations.sort((a, b) => b.priority - a.priority);

  return {
    profile,
    recommendations,
  };
}