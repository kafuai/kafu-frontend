export type TenantStatus =
  | "provisioning"
  | "active"
  | "suspended"
  | "archived";

export type WorkspaceStatus =
  | "active"
  | "disabled"
  | "archived";

export interface TenantWorkspaceSummary {
  tenantId: string;
  workspaceId: string;
  tenantStatus: TenantStatus;
  workspaceStatus: WorkspaceStatus;
}
