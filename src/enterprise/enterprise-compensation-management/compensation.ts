import type {
  CompensationProfile,
  CompensationStatus,
} from "./compensationTypes";

export function createCompensationProfile(
  profile: CompensationProfile
): CompensationProfile {
  return {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
}

export function updateCompensationStatus(
  profile: CompensationProfile,
  status: CompensationStatus
): CompensationProfile {
  return {
    ...profile,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export function isCompensationActive(
  profile: CompensationProfile
): boolean {
  return profile.status === "active";
}
