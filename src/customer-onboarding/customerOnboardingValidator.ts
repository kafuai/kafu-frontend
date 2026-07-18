import { CustomerOnboardingContext } from "./customerOnboardingContext";

export function validateCustomerOnboarding(
  context: CustomerOnboardingContext,
): string[] {
  const issues: string[] = [];

  if (!context.onboarding.organizationId.trim()) {
    issues.push("Organization ID is required.");
  }

  if (!context.onboarding.companyName.trim()) {
    issues.push("Company name is required.");
  }

  if (!context.onboarding.owner.trim()) {
    issues.push("Customer owner is required.");
  }

  if (
    !Number.isFinite(context.onboarding.progress) ||
    context.onboarding.progress < 0 ||
    context.onboarding.progress > 100
  ) {
    issues.push("Onboarding progress must be between 0 and 100.");
  }

  return issues;
}
