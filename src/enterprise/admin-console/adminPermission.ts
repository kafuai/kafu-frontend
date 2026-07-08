import { AdminAccessLevel } from "./adminConsoleTypes";

export interface AdminPermission {
  id: string;
  action: string;
  requiredAccessLevel: AdminAccessLevel;
}

export function hasAdminPermission(
  currentLevel: AdminAccessLevel,
  permission: AdminPermission,
): boolean {
  const rank: Record<AdminAccessLevel, number> = {
    viewer: 1,
    operator: 2,
    admin: 3,
    super_admin: 4,
  };

  return rank[currentLevel] >= rank[permission.requiredAccessLevel];
}
