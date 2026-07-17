export interface CustomerActivationPlan {
  organizationId: string;
  activationOwner: string;
  objectives: string[];
  targetActivationDate?: string;
  requiredActions: string[];
}

export function createCustomerActivationPlan(
  plan: CustomerActivationPlan,
): CustomerActivationPlan {
  return {
    ...plan,
    objectives: [...plan.objectives],
    requiredActions: [...plan.requiredActions],
  };
}
