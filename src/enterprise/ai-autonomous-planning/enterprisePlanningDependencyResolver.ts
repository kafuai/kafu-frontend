import { EnterprisePlanningStep } from "./enterpriseAIPlanningEngineTypes";

export function resolveEnterprisePlanningDependencies(
  steps: EnterprisePlanningStep[]
): EnterprisePlanningStep[] {
  const ids = new Set(steps.map((step) => step.id));

  return steps.map((step) => ({
    ...step,
    dependencies: step.dependencies.filter((dependency) =>
      ids.has(dependency)
    ),
  }));
}