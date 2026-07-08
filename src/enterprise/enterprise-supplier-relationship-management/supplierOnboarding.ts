export interface SupplierOnboardingChecklistItem {
  id: string;
  name: string;
  completed: boolean;
}

export interface SupplierOnboarding {
  supplierId: string;
  checklist: SupplierOnboardingChecklistItem[];
  completedAt?: string;
}

export function isSupplierOnboardingComplete(
  onboarding: SupplierOnboarding
): boolean {
  return onboarding.checklist.every(
    (item) => item.completed
  );
}

export function completeSupplierOnboarding(
  onboarding: SupplierOnboarding
): SupplierOnboarding {
  return {
    ...onboarding,
    completedAt: new Date().toISOString(),
  };
}
