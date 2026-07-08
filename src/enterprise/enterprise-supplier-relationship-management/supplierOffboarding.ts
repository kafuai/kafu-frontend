export interface SupplierOffboarding {
  supplierId: string;
  reason: string;
  approvalsCompleted: boolean;
  completedAt?: string;
}

export function canOffboardSupplier(
  offboarding: SupplierOffboarding
): boolean {
  return offboarding.approvalsCompleted;
}

export function completeSupplierOffboarding(
  offboarding: SupplierOffboarding
): SupplierOffboarding {
  return {
    ...offboarding,
    completedAt: new Date().toISOString(),
  };
}
