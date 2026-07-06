import { EnterpriseAIPlan } from "./enterpriseAIPlanningEngineTypes";

export function optimizeEnterprisePlan(
  plan: EnterpriseAIPlan
): EnterpriseAIPlan {
  const optimizedSteps = [...plan.steps].sort(
    (a, b) => a.dependencies.length - b.dependencies.length
  );

  return {
    ...plan,
    steps: optimizedSteps.map((step, index) => ({
      ...step,
      sequence: index + 1,
    })),
    updatedAt: new Date().toISOString(),
  };
}