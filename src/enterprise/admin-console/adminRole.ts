import { AdminAccessLevel } from "./adminConsoleTypes";

export interface AdminRole {
  id: string;
  tenantId: string;
  name: string;
  accessLevel: AdminAccessLevel;
}

export function canManageRole(role: AdminRole): boolean {
  return role.accessLevel === "admin" || role.accessLevel === "super_admin";
}
