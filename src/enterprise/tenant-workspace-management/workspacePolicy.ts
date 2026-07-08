export interface WorkspacePolicy {
  workspaceId: string;
  allowExternalInvites: boolean;
  requireMfa: boolean;
}

export function isExternalInviteAllowed(
  policy: WorkspacePolicy,
): boolean {
  return policy.allowExternalInvites;
}