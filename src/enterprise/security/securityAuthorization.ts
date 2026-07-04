import {
  SecurityAuthorizationRequest,
  SecurityAuthorizationResult,
  SecurityPermission,
  SecurityRole,
} from "./securityTypes";
import { matchesSecurityPermission } from "./securityPermission";

export function authorizeSecurityRequest(
  request: SecurityAuthorizationRequest,
  roles: SecurityRole[],
  permissions: SecurityPermission[],
): SecurityAuthorizationResult {
  const principalRoles = roles.filter((role) =>
    request.principal.roles.includes(role.id),
  );

  const principalPermissionIds = new Set(
    principalRoles.flatMap((role) => role.permissions),
  );

  const allowedPermissions = permissions.filter((permission) =>
    principalPermissionIds.has(permission.id),
  );

  const matched = allowedPermissions.some((permission) =>
    matchesSecurityPermission(permission, request.resource, request.action),
  );

  if (!matched) {
    return {
      decision: "deny",
      reason: "No matching permission found for principal.",
    };
  }

  return {
    decision: "allow",
    reason: "Principal has matching permission.",
  };
}