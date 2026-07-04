import { DisasterRecoveryPlan } from "./disasterRecoveryTypes";

export type DisasterRecoveryRegistry = {
  plans: DisasterRecoveryPlan[];
};

export function createDisasterRecoveryRegistry(
  plans: DisasterRecoveryPlan[] = [],
): DisasterRecoveryRegistry {
  return {
    plans,
  };
}

export function registerDisasterRecoveryPlan(
  registry: DisasterRecoveryRegistry,
  plan: DisasterRecoveryPlan,
): DisasterRecoveryRegistry {
  const existingPlans = registry.plans.filter(
    (currentPlan) => currentPlan.id !== plan.id,
  );

  return {
    plans: [...existingPlans, plan],
  };
}

export function getDisasterRecoveryPlanById(
  registry: DisasterRecoveryRegistry,
  planId: string,
): DisasterRecoveryPlan | undefined {
  return registry.plans.find((plan) => plan.id === planId);
}

export function listActiveDisasterRecoveryPlans(
  registry: DisasterRecoveryRegistry,
): DisasterRecoveryPlan[] {
  return registry.plans.filter((plan) => plan.status === "active");
}

export function removeDisasterRecoveryPlan(
  registry: DisasterRecoveryRegistry,
  planId: string,
): DisasterRecoveryRegistry {
  return {
    plans: registry.plans.filter((plan) => plan.id !== planId),
  };
}