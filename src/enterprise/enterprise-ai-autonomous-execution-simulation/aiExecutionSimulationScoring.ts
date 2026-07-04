import { AIExecutionSimulationMetrics } from "./aiExecutionSimulationTypes";

export function calculateSimulationScore(
  metrics: AIExecutionSimulationMetrics,
): number {
  const benefitWeight = 0.35;
  const successWeight = 0.35;
  const confidenceWeight = 0.2;
  const costWeight = 0.1;

  const normalizedCost =
    metrics.estimatedCost <= 0
      ? 1
      : 1 / (1 + metrics.estimatedCost / 1000);

  const score =
    metrics.estimatedBenefit * benefitWeight +
    metrics.probabilityOfSuccess * successWeight +
    metrics.confidence * confidenceWeight +
    normalizedCost * costWeight;

  return Number(score.toFixed(4));
}