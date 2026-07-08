export type WorkspaceProvisioningStatus =
  | "pending"
  | "provisioning"
  | "completed"
  | "failed";

export interface WorkspaceProvisioning {
  workspaceId: string;
  status: WorkspaceProvisioningStatus;
  startedAt: Date;
  completedAt?: Date;
}

export function completeProvisioning(
  provisioning: WorkspaceProvisioning,
): WorkspaceProvisioning {
  return {
    ...provisioning,
    status: "completed",
    completedAt: new Date(),
  };
}