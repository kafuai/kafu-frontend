export function calculateCustomerOnboardingProgress(
  completed: number,
  total: number,
): number {
  if (total <= 0) {
    return 0;
  }

  return Math.round((completed / total) * 100);
}