export interface CustomerSuccessPlan {
  organizationId: string;
  customerName: string;
  customerSuccessOwner: string;
  reviewCadence: "weekly" | "biweekly" | "monthly" | "quarterly";
  successObjectives: string[];
  adoptionTargets: string[];
  supportCommitments: string[];
  nextReviewDate?: string;
}

export function createCustomerSuccessPlan(
  plan: CustomerSuccessPlan,
): CustomerSuccessPlan {
  return {
    ...plan,
    successObjectives: [...plan.successObjectives],
    adoptionTargets: [...plan.adoptionTargets],
    supportCommitments: [...plan.supportCommitments],
  };
}
