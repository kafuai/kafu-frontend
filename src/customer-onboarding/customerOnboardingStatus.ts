import { CustomerOnboardingStage } from "./customerOnboardingTypes";

export function isCustomerOnboardingComplete(
  stage: CustomerOnboardingStage,
): boolean {
  return stage === "completed";
}