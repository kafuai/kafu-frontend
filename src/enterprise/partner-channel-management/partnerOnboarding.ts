export type PartnerOnboardingStatus =
  | "not_started"
  | "in_progress"
  | "blocked"
  | "completed";

export interface PartnerOnboarding {
  partnerId: string;
  status: PartnerOnboardingStatus;
  completedSteps: string[];
  remainingSteps: string[];
}

export function completeOnboardingStep(
  onboarding: PartnerOnboarding,
  step: string,
): PartnerOnboarding {
  return {
    ...onboarding,
    completedSteps: Array.from(new Set([...onboarding.completedSteps, step])),
    remainingSteps: onboarding.remainingSteps.filter((item) => item !== step),
  };
}
