import { AIExecutionObjective } from "./aiExecutionObjective";
import { AIExecutionStep } from "./aiExecutionStep";

export interface AIExecutionReadiness {
  ready: boolean;
  score: number;
  missingRequirements: string[];
}

export function evaluateAIExecutionReadiness(
  objective: AIExecutionObjective,
  steps: AIExecutionStep[],
): AIExecutionReadiness {
  const missingRequirements: string[] = [];

  if (!objective.successCriteria.length) {
    missingRequirements.push("Success criteria not defined.");
  }

  if (!steps.length) {
    missingRequirements.push("Execution steps are missing.");
  }

  for (const step of steps) {
    if (!step.requiredCapabilities.length) {
      missingRequirements.push(
        `Step "${step.title}" has no required capabilities.`,
      );
    }

    if (!step.expectedOutput.trim()) {
      missingRequirements.push(
        `Step "${step.title}" has no expected output.`,
      );
    }
  }

  const score = Math.max(
    0,
    100 - missingRequirements.length * 10,
  );

  return {
    ready: missingRequirements.length === 0,
    score,
    missingRequirements,
  };
}