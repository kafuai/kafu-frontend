import type {
  BenefitAdministrationProfile,
  BenefitStatus,
} from "./benefitsTypes";

export function createBenefitsAdministration(
  profile: BenefitAdministrationProfile
): BenefitAdministrationProfile {
  return {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
}

export function updateBenefitStatus(
  profile: BenefitAdministrationProfile,
  status: BenefitStatus
): BenefitAdministrationProfile {
  return {
    ...profile,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export function isBenefitActive(
  profile: BenefitAdministrationProfile
): boolean {
  return profile.status === "active";
}
