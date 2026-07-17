export interface CustomerGoLivePlan {
  organizationId: string;
  goLiveOwner: string;
  targetGoLiveDate: string;
  launchScope: string[];
  supportContacts: string[];
  rollbackPlan?: string;
}

export function createCustomerGoLivePlan(
  plan: CustomerGoLivePlan,
): CustomerGoLivePlan {
  return {
    ...plan,
    launchScope: [...plan.launchScope],
    supportContacts: [...plan.supportContacts],
  };
}
