import { SecurityPermission } from "./securityTypes";

export function createSecurityPermission(
  input: SecurityPermission,
): SecurityPermission {
  return {
    ...input,
  };
}

export function matchesSecurityPermission(
  permission: SecurityPermission,
  resource: string,
  action: string,
): boolean {
  return permission.resource === resource && permission.action === action;
}