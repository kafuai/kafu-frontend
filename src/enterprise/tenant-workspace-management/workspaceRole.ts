export interface WorkspaceRole {
  id: string;
  name: string;
  permissions: string[];
}

export function hasWorkspacePermission(
  role: WorkspaceRole,
  permission: string,
): boolean {
  return role.permissions.includes(permission);
}
