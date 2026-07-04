import {
  BusinessContinuityCriticalService,
  BusinessContinuityPlan,
} from "./businessContinuityTypes";

export function createBusinessContinuityPlan(
  plan: BusinessContinuityPlan,
): BusinessContinuityPlan {
  return {
    ...plan,
    createdAt: plan.createdAt || new Date().toISOString(),
    updatedAt: plan.updatedAt || new Date().toISOString(),
  };
}

export function activateBusinessContinuityPlan(
  plan: BusinessContinuityPlan,
): BusinessContinuityPlan {
  return {
    ...plan,
    status: "active",
    updatedAt: new Date().toISOString(),
  };
}

export function markBusinessContinuityPlanUnderReview(
  plan: BusinessContinuityPlan,
): BusinessContinuityPlan {
  return {
    ...plan,
    status: "under_review",
    lastReviewedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function attachCriticalServiceToPlan(
  plan: BusinessContinuityPlan,
  service: BusinessContinuityCriticalService,
): BusinessContinuityPlan {
  const services = new Set(plan.scope.services);
  services.add(service.id);

  return {
    ...plan,
    scope: {
      ...plan.scope,
      services: Array.from(services),
    },
    updatedAt: new Date().toISOString(),
  };
}

export function isBusinessContinuityPlanActive(
  plan: BusinessContinuityPlan,
): boolean {
  return plan.status === "active" || plan.status === "tested";
}