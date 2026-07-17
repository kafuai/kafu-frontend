import { CustomerOnboardingRecord } from "./customerOnboardingTypes";

export interface CustomerOnboardingContext {
  onboarding: CustomerOnboardingRecord;
  notes: string[];
}