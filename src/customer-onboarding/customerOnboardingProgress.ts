export function calculateCustomerOnboardingProgress(
  completed: number,
  total: number,
): number {
  if (total <= 0 || completed <= 0) {
    return 0;
  }

  const progress = Math.round((completed / total) * 100);

  return Math.min(progress, 100);
}
