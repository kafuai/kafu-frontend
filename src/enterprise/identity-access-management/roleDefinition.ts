import type { IdentityAuditMetadata } from "./identityAccessManagementTypes";

export interface RoleDefinition extends IdentityAuditMetadata {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  systemRole: boolean;
}

export const createRoleDefinition = (
  role: RoleDefinition
): RoleDefinition => role;

export const isSystemRole = (role: RoleDefinition): boolean =>
  role.systemRole;

export const hasPermission = (
  role: RoleDefinition,
  permission: string
): boolean => role.permissions.includes(permission);
