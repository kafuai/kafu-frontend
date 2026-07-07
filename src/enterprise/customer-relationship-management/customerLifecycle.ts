import {
  CustomerLifecycleState,
  CustomerRelationshipLifecycleStage,
} from "./customerRelationshipManagementTypes";

export function createCustomerLifecycleState(input: {
  id: string;
  accountId: string;
  stage: CustomerRelationshipLifecycleStage;
  enteredAt?: string;
  nextMilestone?: string;
  notes?: string;
}): CustomerLifecycleState {
  return {
    id: input.id,
    accountId: input.accountId,
    stage: input.stage,
    enteredAt: input.enteredAt ?? new Date().toISOString(),
    nextMilestone: input.nextMilestone,
    notes: input.notes,
  };
}

export function isCustomerLifecycleRevenueStage(
  lifecycle: CustomerLifecycleState,
): boolean {
  return ["expansion", "renewal", "retention"].includes(lifecycle.stage);
}