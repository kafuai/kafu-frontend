export interface SupplierLifecycleStage {
  supplierId: string;
  stage:
    | "identified"
    | "qualified"
    | "onboarded"
    | "active"
    | "review"
    | "exited";
  changedAt: string;
}

export function moveSupplierLifecycleStage(
  lifecycle: SupplierLifecycleStage,
  stage: SupplierLifecycleStage["stage"]
): SupplierLifecycleStage {
  return {
    ...lifecycle,
    stage,
    changedAt: new Date().toISOString(),
  };
}

export function isSupplierActiveLifecycle(
  lifecycle: SupplierLifecycleStage
): boolean {
  return lifecycle.stage === "active";
}
