import { CustomerOnboardingContext } from "./customerOnboardingContext";

export function buildCustomerOnboardingSummary(
  context: CustomerOnboardingContext,
): string {
  return [
    `Company: ${context.onboarding.companyName}`,
    `Stage: ${context.onboarding.stage}`,
    `Progress: ${context.onboarding.progress}%`,
  ].join("\n");
}