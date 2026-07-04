import { AIExecutionValidationMetrics } from "./aiAutonomousExecutionValidationTypes";

export function scoreAIExecutionValidation(
  metrics: AIExecutionValidationMetrics
): number {
  return Number(
    (
      (metrics.integrityScore +
        metrics.assumptionScore +
        metrics.feasibilityScore +
        metrics.riskScore +
        metrics.readinessScore) /
      5
    ).toFixed(2)
  );
}