import type {
  HumanCapitalProfile,
  HumanCapitalStatus,
} from "./humanCapitalTypes";

export function createHumanCapitalProfile(
  profile: HumanCapitalProfile
): HumanCapitalProfile {
  return {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
}

export function updateHumanCapitalStatus(
  profile: HumanCapitalProfile,
  status: HumanCapitalStatus
): HumanCapitalProfile {
  return {
    ...profile,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export function isHumanCapitalActive(
  profile: HumanCapitalProfile
): boolean {
  return profile.status === "active";
}
