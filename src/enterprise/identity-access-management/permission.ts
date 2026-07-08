import type {
  IdentityAuditMetadata,
  PermissionEffect,
} from "./identityAccessManagementTypes";

export interface Permission extends IdentityAuditMetadata {
  id: string;
  resource: string;
  action: string;
  effect: PermissionEffect;
  description?: string;
}

export const createPermission = (
  permission: Permission
): Permission => permission;

export const isAllowedPermission = (
  permission: Permission
): boolean => permission.effect === "allow";

export const permissionKey = (permission: Permission): string =>
  `${permission.resource}:${permission.action}`;
