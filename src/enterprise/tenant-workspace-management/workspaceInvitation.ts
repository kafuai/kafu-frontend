export type WorkspaceInvitationStatus =
  | "pending"
  | "accepted"
  | "expired";

export interface WorkspaceInvitation {
  id: string;
  workspaceId: string;
  email: string;
  status: WorkspaceInvitationStatus;
}

export function acceptWorkspaceInvitation(
  invitation: WorkspaceInvitation,
): WorkspaceInvitation {
  return {
    ...invitation,
    status: "accepted",
  };
}