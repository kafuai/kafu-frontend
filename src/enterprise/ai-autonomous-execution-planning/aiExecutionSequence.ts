import { AIExecutionDependency } from "./aiExecutionDependency";
import { AIExecutionStep } from "./aiExecutionStep";

export function sortAIExecutionSteps(
  steps: AIExecutionStep[],
  dependencies: AIExecutionDependency[],
): AIExecutionStep[] {
  const ordered: AIExecutionStep[] = [];
  const added = new Set<string>();

  while (ordered.length < steps.length) {
    let progress = false;

    for (const step of steps) {
      if (added.has(step.id)) {
        continue;
      }

      const blockers = dependencies.filter(
        (dependency) =>
          dependency.stepId === step.id &&
          dependency.mandatory,
      );

      const satisfied = blockers.every((dependency) =>
        added.has(dependency.dependsOnStepId),
      );

      if (!satisfied) {
        continue;
      }

      ordered.push(step);
      added.add(step.id);
      progress = true;
    }

    if (!progress) {
      throw new Error(
        "Circular execution dependency detected.",
      );
    }
  }

  return ordered;
}