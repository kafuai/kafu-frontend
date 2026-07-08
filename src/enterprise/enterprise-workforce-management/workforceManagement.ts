import type {
  WorkforceManagementProfile,
  WorkforceManagementStatus,
} from "./workforceManagementTypes";

export function createWorkforceManagement(
  profile: WorkforceManagementProfile
): WorkforceManagementProfile {
  return {
    ...profile,
    updatedAt: new Date().toISOString(),
  };
}

export function updateWorkforceStatus(
  profile: WorkforceManagementProfile,
  status: WorkforceManagementStatus
): WorkforceManagementProfile {
  return {
    ...profile,
    status,
    updatedAt: new Date().toISOString(),
  };
}

export function isWorkforceActive(
  profile: WorkforceManagementProfile
): boolean {
  return profile.status === "active";
}
