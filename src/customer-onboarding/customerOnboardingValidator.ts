import { CustomerOnboardingContext } from "./customerOnboardingContext";

export function validateCustomerOnboarding(
  context: CustomerOnboardingContext,
): string[] {
  const issues: string[] = [];

  if (!context.onboarding.companyName) {
    issues.push("Company name is required.");
  }

  if (!context.onboarding.owner) {
    issues.push("Customer owner is required.");
  }

  return issues;
}