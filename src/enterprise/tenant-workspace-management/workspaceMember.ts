export interface WorkspaceMember {
  userId: string;
  workspaceId: string;
  roleId: string;
  joinedAt: Date;
}

export function addWorkspaceMember(
  member: WorkspaceMember,
): WorkspaceMember {
  return member;
}
