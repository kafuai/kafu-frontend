import type {
  PerformanceProfile,
  PerformanceStatus,
} from "./performanceTypes";

export function createPerformanceProfile(
  profile: PerformanceProfile
): PerformanceProfile {
  return {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
}

export function updatePerformanceStatus(
  profile: PerformanceProfile,
  status: PerformanceStatus
): PerformanceProfile {
  return {
    ...profile,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export function isPerformanceActive(
  profile: PerformanceProfile
): boolean {
  return profile.status === "active";
}
