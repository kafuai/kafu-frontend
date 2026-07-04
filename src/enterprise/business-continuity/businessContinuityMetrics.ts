import { BusinessContinuityPlan } from "./businessContinuityTypes";

export type BusinessContinuityMetrics = {
  activePlans: number;
  testedPlans: number;
  reviewCoverage: number;
};

export function calculateBusinessContinuityMetrics(
  plans: BusinessContinuityPlan[],
): BusinessContinuityMetrics {
  const activePlans = plans.filter((p) => p.status === "active").length;
  const testedPlans = plans.filter((p) => p.status === "tested").length;

  const reviewedPlans = plans.filter(
    (p) => p.lastReviewedAt !== undefined,
  ).length;

  return {
    activePlans,
    testedPlans,
    reviewCoverage:
      plans.length === 0
        ? 0
        : Math.round((reviewedPlans / plans.length) * 100),
  };
}