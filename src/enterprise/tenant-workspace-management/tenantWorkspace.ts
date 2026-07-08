import type { WorkspaceStatus } from "./tenantWorkspaceTypes";

export interface TenantWorkspace {
  id: string;
  tenantId: string;
  name: string;
  status: WorkspaceStatus;
}

export function createWorkspace(
  workspace: TenantWorkspace,
): TenantWorkspace {
  return workspace;
}
