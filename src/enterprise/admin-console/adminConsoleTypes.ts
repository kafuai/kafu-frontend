export type AdminConsoleStatus =
  | "active"
  | "inactive"
  | "maintenance";

export type AdminAccessLevel =
  | "viewer"
  | "operator"
  | "admin"
  | "super_admin";

export interface AdminConsoleContext {
  tenantId: string;
  workspaceId?: string;
  actorId: string;
  accessLevel: AdminAccessLevel;
  status: AdminConsoleStatus;
}
