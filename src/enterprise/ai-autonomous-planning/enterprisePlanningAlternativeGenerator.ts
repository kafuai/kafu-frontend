import {
  EnterpriseAIPlan,
  EnterprisePlanningStep,
} from "./enterpriseAIPlanningEngineTypes";

export function generateAlternativeEnterprisePlans(
  basePlan: EnterpriseAIPlan
): EnterpriseAIPlan[] {
  return [
    createAlternative(basePlan, "balanced", 1),
    createAlternative(basePlan, "aggressive", 2),
    createAlternative(basePlan, "conservative", 3),
  ];
}

function createAlternative(
  plan: EnterpriseAIPlan,
  mode: string,
  offset: number
): EnterpriseAIPlan {
  const reorderedSteps: EnterprisePlanningStep[] =
    mode === "aggressive"
      ? [...plan.steps].sort((a, b) => a.sequence - b.sequence)
      : mode === "conservative"
      ? [...plan.steps].reverse()
      : [...plan.steps];

  return {
    ...plan,
    id: `${plan.id}-${mode}`,
    title: `${plan.title} (${mode})`,
    steps: reorderedSteps.map((step, index) => ({
      ...step,
      sequence: index + 1,
    })),
    updatedAt: new Date().toISOString(),
    confidenceScore:
      mode === "balanced"
        ? plan.confidenceScore
        : Number((plan.confidenceScore - offset * 0.02).toFixed(2)),
  };
}