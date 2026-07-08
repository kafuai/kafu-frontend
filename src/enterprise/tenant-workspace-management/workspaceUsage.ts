export interface WorkspaceUsage {
  workspaceId: string;
  users: number;
  storageGb: number;
  projects: number;
  updatedAt: Date;
}

export function calculateStorageUtilization(
  usage: WorkspaceUsage,
  quotaGb: number,
): number {
  if (quotaGb <= 0) return 0;

  return usage.storageGb / quotaGb;
}