import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
  ROUTE_PERMISSIONS,
  type Permission,
} from "./permissions";

export function hasPermission(
  role: string,
  permission: Permission,
): boolean {
  const normalizedRole = role.trim().toLowerCase();

  const permissions = ROLE_PERMISSIONS[normalizedRole] ?? [];

  return (
    permissions.includes(PERMISSIONS.ALL) ||
    permissions.includes(permission)
  );
}

export function getRoutePermission(
  pathname: string,
): Permission | null {
  const matchedRoute = Object.keys(ROUTE_PERMISSIONS)
    .sort((a, b) => b.length - a.length)
    .find(
      (route) =>
        pathname === route ||
        pathname.startsWith(`${route}/`),
    );

  if (!matchedRoute) {
    return null;
  }

  return ROUTE_PERMISSIONS[matchedRoute];
}