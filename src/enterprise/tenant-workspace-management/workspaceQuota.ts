export interface WorkspaceQuota {
  workspaceId: string;
  maxUsers: number;
  maxStorageGb: number;
  maxProjects: number;
}

export function hasAvailableUserCapacity(
  quota: WorkspaceQuota,
  currentUsers: number,
): boolean {
  return currentUsers < quota.maxUsers;
}