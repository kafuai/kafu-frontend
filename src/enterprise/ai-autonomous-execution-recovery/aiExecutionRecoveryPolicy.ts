import { AIExecutionRecoveryAssessment } from "./aiExecutionRecoveryAssessment";
import { AIExecutionRecoveryStrategy } from "./aiExecutionRecoveryTypes";

export interface AIExecutionRecoveryPolicy {
  allowedStrategies: AIExecutionRecoveryStrategy[];
  minimumConfidence: number;
}

export function validateAIExecutionRecoveryPolicy(
  assessment: AIExecutionRecoveryAssessment,
  policy: AIExecutionRecoveryPolicy,
): boolean {
  if (assessment.confidence < policy.minimumConfidence) {
    return false;
  }

  return policy.allowedStrategies.includes(
    assessment.recommendedStrategy,
  );
}

export function createDefaultAIExecutionRecoveryPolicy(): AIExecutionRecoveryPolicy {
  return {
    allowedStrategies: [
      "retry",
      "fallback",
      "rollback",
      "compensating_action",
      "manual_escalation",
    ],
    minimumConfidence: 0.5,
  };
}