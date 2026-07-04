import { AIExecutionStep } from "./aiExecutionStep";

const riskWeight: Record<AIExecutionStep["riskLevel"], number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const priorityWeight: Record<AIExecutionStep["priority"], number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function sequenceAIExecutionStepsByRisk(
  steps: AIExecutionStep[],
): AIExecutionStep[] {
  return [...steps].sort((first, second) => {
    const riskDelta =
      riskWeight[first.riskLevel] - riskWeight[second.riskLevel];

    if (riskDelta !== 0) {
      return riskDelta;
    }

    return priorityWeight[second.priority] - priorityWeight[first.priority];
  });
}