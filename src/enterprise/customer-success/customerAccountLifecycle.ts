import type { CustomerLifecycleStage } from "./customerSuccessTypes";

export interface CustomerAccountLifecycle {
  accountId: string;
  currentStage: CustomerLifecycleStage;
  previousStage?: CustomerLifecycleStage;
  updatedAt: Date;
}

export function transitionLifecycle(
  lifecycle: CustomerAccountLifecycle,
  stage: CustomerLifecycleStage,
): CustomerAccountLifecycle {
  return {
    ...lifecycle,
    previousStage: lifecycle.currentStage,
    currentStage: stage,
    updatedAt: new Date(),
  };
}