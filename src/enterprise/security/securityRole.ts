import { SecurityRole } from "./securityTypes";

export function createSecurityRole(input: SecurityRole): SecurityRole {
  return {
    ...input,
  };
}

export function roleHasPermission(
  role: SecurityRole,
  permissionId: string,
): boolean {
  return role.permissions.includes(permissionId);
}